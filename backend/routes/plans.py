from fastapi import APIRouter
from models import Plan, PlanListResponse
from config import settings

router = APIRouter(tags=["plans"])

# Feature lists per plan category
_KZ_FEATURES = [
    "Spotify Family slot",
    "Pay via Kaspi Bank",
    "Admin-verified setup",
    "Automated payment reminders",
    "Cancel anytime",
]
_RU_GROUP_FEATURES = [
    "Spotify Family slot",
    "Pay via Card or SBP",
    "Admin-verified setup",
    "Automated payment reminders",
    "Cancel anytime",
]
_RU_INDIVIDUAL_FEATURES = [
    "Personal Spotify account",
    "No sharing — just you",
    "Monthly auto-reminders",
    "Flexible payment day (1–28)",
    "Card or SBP payment",
]
_RU_DUO_FEATURES = [
    "Two-person shared account",
    "Lower per-person cost",
    "Monthly auto-reminders",
    "Flexible payment day (1–28)",
    "Card or SBP payment",
]


def _kz_plans() -> list[Plan]:
    base = settings.bot_default_payment_price
    plans = []
    for months, highlighted in [(1, False), (3, True), (6, False)]:
        plans.append(Plan(
            id=f"kz_group_{months}m",
            name=f"{months} Month{'s' if months > 1 else ''}",
            region="KZ",
            plan_type="group",
            price=base * months,
            price_per_month=base,
            currency="₸",
            duration_months=months,
            features=_KZ_FEATURES,
            highlighted=highlighted,
        ))
    return plans


def _ru_group_plans() -> list[Plan]:
    base = settings.bot_ru_payment_price
    plans = []
    for months, highlighted in [(1, False), (3, False), (6, True), (12, False)]:
        plans.append(Plan(
            id=f"ru_group_{months}m",
            name=f"{months} Month{'s' if months > 1 else ''}",
            region="RU",
            plan_type="group",
            price=base * months,
            price_per_month=base,
            currency="₽",
            duration_months=months,
            features=_RU_GROUP_FEATURES,
            highlighted=highlighted,
        ))
    return plans


def _ru_individual_plans() -> list[Plan]:
    return [
        Plan(
            id="ru_individual_1m",
            name="Individual",
            region="RU",
            plan_type="individual",
            price=settings.bot_ru_individual_price,
            price_per_month=settings.bot_ru_individual_price,
            currency="₽",
            duration_months=1,
            features=_RU_INDIVIDUAL_FEATURES,
            highlighted=False,
        ),
        Plan(
            id="ru_duo_1m",
            name="Duo",
            region="RU",
            plan_type="duo",
            price=settings.bot_ru_duo_price,
            price_per_month=settings.bot_ru_duo_price,
            currency="₽",
            duration_months=1,
            features=_RU_DUO_FEATURES,
            highlighted=True,
        ),
    ]


@router.get("/plans", response_model=PlanListResponse, summary="List all subscription plans")
async def get_plans() -> PlanListResponse:
    """
    Return all available subscription plans grouped by region and type.
    Prices are read from environment variables, keeping them in sync with the Telegram bot.
    """
    return PlanListResponse(
        kz_plans=_kz_plans(),
        ru_group_plans=_ru_group_plans(),
        ru_individual_plans=_ru_individual_plans(),
    )
