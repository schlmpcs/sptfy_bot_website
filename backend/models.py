from __future__ import annotations
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


# ── Plans ─────────────────────────────────────────────────────────────────────

class Plan(BaseModel):
    id: str
    name: str
    region: str           # "KZ" | "RU"
    plan_type: str        # "group" | "individual" | "duo"
    price: int            # total price
    price_per_month: int  # price ÷ duration
    currency: str         # "₸" | "₽"
    duration_months: int
    features: list[str]
    highlighted: bool = False  # show as "Popular"


class PlanListResponse(BaseModel):
    kz_plans: list[Plan]
    ru_group_plans: list[Plan]
    ru_individual_plans: list[Plan]


# ── User subscription ─────────────────────────────────────────────────────────

class GroupInfo(BaseModel):
    group_name: str
    display_id: str
    region: str           # "KZ" | "RU"
    next_payment_date: Optional[datetime]
    slots: int
    days_until_due: Optional[int]


class IndividualInfo(BaseModel):
    plan: str             # "individual" | "duo" | "family_individual"
    price: int
    currency: str         # always "₽" for RU
    payment_day: int
    next_payment_date: Optional[date]
    is_active: bool
    days_until_due: Optional[int]


class UserSubscription(BaseModel):
    telegram_id: int
    first_name: Optional[str]
    username: Optional[str]
    display_id: Optional[str]
    groups: list[GroupInfo]
    individual_clients: list[IndividualInfo]
    has_active_subscription: bool


# ── Subscribe ─────────────────────────────────────────────────────────────────

class SubscribeRequest(BaseModel):
    telegram_id: Optional[int] = None   # not collected on the website
    region: str    # "KZ" | "RU"
    plan_type: str # "group" | "individual" | "duo"
    months: int


class SubscribeResponse(BaseModel):
    success: bool
    message: str
    telegram_bot_url: str


# ── Health ────────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    database: str
    timestamp: datetime
