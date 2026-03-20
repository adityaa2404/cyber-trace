from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://ctuser:ctpass@localhost:3306/cybertrace"
    CORS_ORIGINS: str = "http://localhost:5173"
    DEBUG: bool = True

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
