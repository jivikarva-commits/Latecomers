import asyncio
from unittest import TestCase
from unittest.mock import patch

import data_routes
from career_catalog import ALLOWED_CAREER_SLUGS
from aviation_guides import GUIDES, aviation_guide

MENU = ["Cabin Crew / Air Hostess", "Airport Ground Staff", "Aviation Operations Manager", "Hotel Front Office Executive", "F&B Manager", "Event Manager", "Cruise Line Hospitality Staff"]


class AviationGuidesTest(TestCase):
    def test_every_menu_role_has_a_guide(self):
        self.assertEqual(len(GUIDES), len(MENU))
        for title in MENU:
            with self.subTest(title=title):
                self.assertIsNotNone(aviation_guide(title))

    def test_slugs_resolve_without_ai(self):
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                self.assertIn(g["slug"], ALLOWED_CAREER_SLUGS)
                with patch.object(data_routes, "db", side_effect=AssertionError("no db")), \
                     patch.object(data_routes, "_start_career_detail_generation", side_effect=AssertionError("no AI")):
                    detail = asyncio.run(data_routes._get_career_detail_by_slug(g["slug"], None))
                self.assertFalse(detail["detailsGeneratedByAI"])
                self.assertEqual(detail["category"], "Aviation & Hospitality")

    def test_menu_titles_reach_guides_through_generate(self):
        for title in MENU:
            with self.subTest(title=title), patch.object(data_routes, "db", side_effect=AssertionError("no db")):
                result = asyncio.run(data_routes.generate_career(data_routes.CareerGenerateRequest(title=title), None))
                self.assertIn("guideProfile", result)

    def test_structure(self):
        slugs = {g["slug"] for g in GUIDES}
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                d = g["guideProfile"]["details"]
                self.assertEqual(d["steps"][0]["title"], "Education requirement")
                self.assertTrue(4 <= len(d["institutes"]) <= 5)
                self.assertTrue(all(i["url"].startswith("https://") for i in d["institutes"]))
                self.assertGreaterEqual(len(d["faqs"]), 3)
                self.assertTrue(all(r["slug"] in slugs for r in d["related"]))
                self.assertEqual([x["id"] for x in d["extraSections"]], ["tools", "typical-day", "interview-questions", "ways-to-earn"])
                self.assertEqual(d["labels"]["back"][0], "/careers-explore?field=aviation")
