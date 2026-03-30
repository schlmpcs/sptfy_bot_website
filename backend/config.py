from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    db_host: str = "localhost"
    db_port: int = 5432
    db_username: str = "postgres"
    db_password: str = ""
    db_database: str = "spotify_bot"
    db_ssl_mode: str = "disable"

    # Pricing — kept in sync with bot's .env
    bot_default_payment_price: int = 700   # KZ ₸/month
    bot_ru_payment_price: int = 200        # RU group ₽/month
    bot_ru_individual_price: int = 250     # RU individual ₽/month
    bot_ru_duo_price: int = 600            # RU duo ₽/month
    bot_support_username: str = "sptfy_premium"

    # CORS
    frontend_url: str = "http://localhost:5173"

    @property
    def db_dsn(self) -> str:
        ssl = f"?ssl={self.db_ssl_mode}" if self.db_ssl_mode != "disable" else ""
        return (
            f"postgresql://{self.db_username}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_database}{ssl}"
        )

    @property
    def telegram_bot_url(self) -> str:
        return f"https://t.me/{self.bot_support_username}"


settings = Settings()
