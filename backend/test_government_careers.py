import asyncio
import re
from pathlib import Path
from unittest import TestCase
from unittest.mock import patch, MagicMock, AsyncMock

import data_routes
from government_careers import GUIDES, government_career, government_careers


class GovernmentGuidesTest(TestCase):
    def test_every_government_menu_title_and_legacy_title_resolves(self):
        menu = (Path(__file__).parents[1] / "frontend/src/data/careerCategories.js").read_text(encoding="utf-8")
        section = menu.split('key: "government"', 1)[1].split('key: "law-mgmt"', 1)[0]
        titles = [title for row in re.findall(r"roles: \[(.*?)\]", section) for title in re.findall(r'"([^"]+)"', row)]
        self.assertEqual(len(titles), 15)
        self.assertEqual(len({government_career(title)["slug"] for title in titles}), 15)
        for g in GUIDES:
            for alias in g["aliases"]:
                self.assertEqual(government_career(alias)["slug"], g["slug"])

    def test_authoritative_routes_never_touch_database_or_ai(self):
        with patch.object(data_routes, "db", side_effect=AssertionError("must not use stale cache")), patch.object(data_routes, "_start_career_detail_generation", side_effect=AssertionError("must not generate facts")):
            for g in GUIDES:
                detail = asyncio.run(data_routes._get_career_detail_by_slug(g["slug"], None))
                generated = asyncio.run(data_routes.generate_career(data_routes.CareerGenerateRequest(title=g["title"]), None))
                self.assertEqual(detail, generated)
                self.assertFalse(detail["detailsGeneratedByAI"])
                self.assertNotIn("aiGeneratedDetails", detail)
                self.assertEqual(detail["avgSalary"], {})

    def test_list_replaces_stale_records_and_includes_unseeded_guides(self):
        cursor = MagicMock()
        cursor.limit.return_value = cursor
        cursor.to_list = AsyncMock(return_value=[{"slug": "bank-clerk", "title": "Bank Clerk", "avgSalary": {"min": 99, "max": 100}}])
        database = MagicMock()
        database.careers.find.return_value = cursor
        with patch.object(data_routes, "db", return_value=database):
            result = asyncio.run(data_routes.list_careers(None))
        self.assertEqual(len(result), 15)
        self.assertEqual(len({r["slug"] for r in result}), 15)
        self.assertTrue(all(r["governmentProfile"] for r in result))
        self.assertEqual([r["slug"] for r in government_careers("Talathi")], ["village-revenue-officer-talathi"])

    def test_fresh_response_and_non_government_fallback(self):
        result = government_career("Bank Clerk")
        result["governmentProfile"]["eligibility"].clear()
        self.assertTrue(government_career("Bank Clerk")["governmentProfile"]["eligibility"])
        self.assertIsNone(government_career("Frontend Developer"))
        with patch.object(data_routes, "_ensure_catalog_career", new=AsyncMock(return_value={"slug": "frontend-developer"})), patch.object(data_routes, "_career_details_fresh", return_value=False), patch.object(data_routes, "_start_career_detail_generation") as generate, patch.object(data_routes, "_fallback_career_response", return_value={"fallback": True}):
            self.assertEqual(asyncio.run(data_routes._get_career_detail_by_slug("frontend-developer", None)), {"fallback": True})
            generate.assert_called_once()

    def test_each_guide_has_review_scope_and_both_source_types(self):
        for g in GUIDES:
            with self.subTest(title=g["title"]):
                self.assertTrue(g["sourceCycle"] and g["caution"] and g["eligibility"] and g["selection"] and g["pay"])
                self.assertEqual({s["kind"] for s in g["sources"]}, {"official", "institute"})
                self.assertTrue(all(s["url"].startswith("https://") and s["scope"] for s in g["sources"]))
