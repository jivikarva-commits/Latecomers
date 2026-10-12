import asyncio
from unittest import TestCase
from unittest.mock import patch

import data_routes
from career_catalog import ALLOWED_CAREER_SLUGS
from marketing_guides import GUIDES, marketing_guide

MENU = ["SEO Specialist", "Performance Marketing Manager", "Social Media Manager", "Content Marketer / Strategist", "Copywriter",
        "Affiliate Marketer", "CRM Specialist", "Sales Executive / BDE", "Entrepreneur / Founder"]


class MarketingGuidesTest(TestCase):
    def test_every_menu_role_has_a_guide(self):
        for title in MENU:
            with self.subTest(title=title):
                self.assertIsNotNone(marketing_guide(title))

    def test_slugs_resolve_without_ai(self):
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                self.assertIn(g["slug"], ALLOWED_CAREER_SLUGS)
                with patch.object(data_routes, "db", side_effect=AssertionError("no db")), \
                     patch.object(data_routes, "_start_career_detail_generation", side_effect=AssertionError("no AI")):
                    detail = asyncio.run(data_routes._get_career_detail_by_slug(g["slug"], None))
                self.assertFalse(detail["detailsGeneratedByAI"])
                self.assertEqual(detail["category"], "Digital Marketing")

    def test_menu_titles_reach_guides_through_generate(self):
        for title in MENU:
            with self.subTest(title=title), patch.object(data_routes, "db", side_effect=AssertionError("no db")):
                result = asyncio.run(data_routes.generate_career(data_routes.CareerGenerateRequest(title=title), None))
                self.assertIn("guideProfile", result)

    def test_big_structure_and_institutes(self):
        slugs = {g["slug"] for g in GUIDES}
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                d = g["guideProfile"]["details"]
                self.assertTrue(4 <= len(d["institutes"]) <= 5)
                self.assertEqual([x["id"] for x in d["extraSections"]], ["tools", "typical-day", "projects", "interview-questions", "ways-to-earn"])
                self.assertGreaterEqual(len(d["faqs"]), 3)
                self.assertTrue(all(r["slug"] in slugs for r in d["related"]))
                self.assertEqual(d["labels"]["back"][0], "/careers-explore?field=marketing")


class EducationStepTest(TestCase):
    def test_every_tech_and_marketing_guide_starts_with_education(self):
        from data_ai_guides import GUIDES as A
        from security_cloud_guides import GUIDES as B
        from tech_guides import GUIDES as C
        for g in [*A, *B, *C, *GUIDES]:
            with self.subTest(slug=g["slug"]):
                first = g["guideProfile"]["details"]["steps"][0]
                self.assertEqual(first["title"], "Education requirement")
                self.assertGreater(len(first["detail"]), 120)
