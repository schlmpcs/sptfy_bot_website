from datetime import datetime, date, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
import asyncpg

from database import get_db
from models import UserSubscription, GroupInfo, IndividualInfo, SubscribeRequest, SubscribeResponse
from config import settings

router = APIRouter(tags=["users"])


def _days_until(target: Optional[date | datetime]) -> Optional[int]:
    if target is None:
        return None
    today = datetime.now(timezone.utc).date()
    if isinstance(target, datetime):
        target = target.date()
    return (target - today).days


@router.get(
    "/user/{telegram_id}",
    response_model=UserSubscription,
    summary="Get user subscription status",
)
async def get_user(
    telegram_id: int,
    conn: asyncpg.Connection = Depends(get_db),
) -> UserSubscription:
    """
    Return the subscription status for a Telegram user.

    Queries the users, user_groups, groups, and individual_clients tables
    from the shared bot database.
    """
    # ── 1. Look up the user ───────────────────────────────────────────────────
    user_row = await conn.fetchrow(
        "SELECT user_id, username, first_name, display_id FROM users WHERE user_id = $1",
        telegram_id,
    )
    if user_row is None:
        raise HTTPException(status_code=404, detail="User not found")

    # ── 2. Group memberships ──────────────────────────────────────────────────
    group_rows = await conn.fetch(
        """
        SELECT g.group_name, g.display_id, g.next_payment_date, ug.slots
        FROM user_groups ug
        JOIN groups g ON ug.group_id = g.group_id
        WHERE ug.user_id = $1 AND ug.is_phantom = FALSE
        ORDER BY g.display_id
        """,
        telegram_id,
    )

    groups: list[GroupInfo] = []
    for row in group_rows:
        region = "RU" if row["display_id"].lstrip("0").isdigit() and int(row["display_id"]) >= 100 else "KZ"
        groups.append(GroupInfo(
            group_name=row["group_name"],
            display_id=row["display_id"],
            region=region,
            next_payment_date=row["next_payment_date"],
            slots=row["slots"],
            days_until_due=_days_until(row["next_payment_date"]),
        ))

    # ── 3. Individual clients (RU) ─────────────────────────────────────────────
    individual_rows = await conn.fetch(
        """
        SELECT plan, price, payment_day, next_payment_date, is_active
        FROM individual_clients
        WHERE user_id = $1
        ORDER BY created_at DESC
        """,
        telegram_id,
    )

    individual_clients: list[IndividualInfo] = [
        IndividualInfo(
            plan=row["plan"],
            price=row["price"],
            currency="₽",
            payment_day=row["payment_day"],
            next_payment_date=row["next_payment_date"],
            is_active=row["is_active"],
            days_until_due=_days_until(row["next_payment_date"]) if row["is_active"] else None,
        )
        for row in individual_rows
    ]

    has_active = bool(groups) or any(c.is_active for c in individual_clients)

    return UserSubscription(
        telegram_id=telegram_id,
        first_name=user_row["first_name"],
        username=user_row["username"],
        display_id=user_row["display_id"],
        groups=groups,
        individual_clients=individual_clients,
        has_active_subscription=has_active,
    )


@router.post(
    "/user/subscribe",
    response_model=SubscribeResponse,
    summary="Initiate a subscription",
)
async def subscribe(body: SubscribeRequest) -> SubscribeResponse:
    """
    Validate the subscription request and return the Telegram bot URL
    where the user should complete the purchase.

    Purchases are completed inside the Telegram bot — this endpoint simply
    validates the input and directs the user to the correct entry point.
    """
    valid_regions = {"KZ", "RU"}
    valid_types = {"group", "individual", "duo"}

    if body.region.upper() not in valid_regions:
        raise HTTPException(status_code=400, detail=f"region must be one of {valid_regions}")
    if body.plan_type.lower() not in valid_types:
        raise HTTPException(status_code=400, detail=f"plan_type must be one of {valid_types}")
    if not (1 <= body.months <= 12):
        raise HTTPException(status_code=400, detail="months must be between 1 and 12")

    region_label = "Kazakhstan" if body.region.upper() == "KZ" else "Russia"
    return SubscribeResponse(
        success=True,
        message=(
            f"Ready to subscribe to a {body.months}-month {body.plan_type} plan "
            f"for {region_label}. Open the Telegram bot to complete your purchase."
        ),
        telegram_bot_url=settings.telegram_bot_url,
    )
