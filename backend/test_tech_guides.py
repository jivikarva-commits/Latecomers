import asyncio
from unittest import TestCase
from unittest.mock import patch

import data_routes
from career_catalog import ALLOWED_CAREER_SLUGS
from data_ai_guides import GUIDES as DATA_AI_GUIDES
from security_cloud_guides import GUIDES as SEC_CLOUD_GUIDES
from tech_guides import GUIDES as WEB_GUIDES, tech_guide

GUIDES = [*WEB_GUIDES, *DATA_AI_GUIDES, *SEC_CLOUD_GUIDES]


class TechGuidesTest(TestCase):
    def test_menu_titles_resolve_to_curated_guides_without_ai(self):
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                self.assertIn(g["slug"], ALLOWED_CAREER_SLUGS)
                with patch.object(data_routes, "db", side_effect=AssertionError("no db")), \
                     patch.object(data_routes, "_start_career_detail_generation", side_effect=AssertionError("no AI")):
                    detail = asyncio.run(data_routes._get_career_detail_by_slug(g["slug"], None))
                self.assertFalse(detail["detailsGeneratedByAI"])
                self.assertIn("guideProfile", detail)

    def test_each_guide_ends_with_four_to_five_institutes(self):
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                d = g["guideProfile"]["details"]
                self.assertTrue(4 <= len(d["institutes"]) <= 5)
                self.assertTrue(all(i["url"].startswith("https://") and i["covers"] and i["bestFor"] for i in d["institutes"]))
                for key in ["quickFacts", "role", "steps", "examStages", "passingRules", "calendar", "prepPlan", "freeResources", "careerLadder", "faqs", "related"]:
                    self.assertTrue(d.get(key), key)

    def test_frontend_developer_uses_the_new_structure(self):
        self.assertEqual(tech_guide("Frontend Developer")["slug"], "frontend-developer")

    def test_menu_titles_reach_guides_through_generate(self):
        for g in GUIDES:
            with self.subTest(title=g["title"]), patch.object(data_routes, "db", side_effect=AssertionError("no db")):
                result = asyncio.run(data_routes.generate_career(data_routes.CareerGenerateRequest(title=g["title"]), None))
                self.assertEqual(result["slug"], g["slug"])

    def test_related_links_point_to_existing_tech_guides(self):
        slugs = {g["slug"] for g in GUIDES}
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                self.assertTrue(all(r["slug"] in slugs for r in g["guideProfile"]["details"]["related"]))

    def test_retired_certifications_are_not_listed(self):
        for g in GUIDES:
            names = " ".join(i["name"] for i in g["guideProfile"]["details"]["institutes"])
            self.assertNotIn("AZ-500", names)
            self.assertNotIn("AI-102", names)
