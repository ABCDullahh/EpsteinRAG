from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities import User


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def find_by_google_id(self, google_id: str) -> Optional[User]:
        result = await self.session.execute(
            text("SELECT * FROM users WHERE google_id = :gid"),
            {"gid": google_id},
        )
        row = result.mappings().fetchone()
        if not row:
            return None
        return User(**row)

    async def find_by_id(self, user_id: UUID) -> Optional[User]:
        result = await self.session.execute(
            text("SELECT * FROM users WHERE id = :id"),
            {"id": str(user_id)},
        )
        row = result.mappings().fetchone()
        if not row:
            return None
        return User(**row)

    async def create(self, google_id: str, email: str, name: str | None, picture: str | None) -> User:
        result = await self.session.execute(
            text("""
                INSERT INTO users (google_id, email, name, picture, last_login_at)
                VALUES (:gid, :email, :name, :picture, :now)
                RETURNING *
            """),
            {
                "gid": google_id,
                "email": email,
                "name": name,
                "picture": picture,
                "now": datetime.utcnow(),
            },
        )
        await self.session.commit()
        row = result.mappings().fetchone()
        return User(**row)

    async def update_login(self, user_id: UUID) -> None:
        await self.session.execute(
            text("UPDATE users SET last_login_at = :now WHERE id = :id"),
            {"now": datetime.utcnow(), "id": str(user_id)},
        )
        await self.session.commit()
