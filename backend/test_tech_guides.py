import asyncio
from unittest import TestCase
from unittest.mock import patch

import data_routes
from career_catalog import ALLOWED_CAREER_SLUGS
from tech_guides import GUIDES, tech_guide


class TechGuidesTest(TestCase):
    def test_menu_titles_resolve_to_curated_guides_without_ai(self):
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                self.assertIn(g["slug"], ALLOWED_CAREER_SLUGS)
                self.assertEqual(tech_guide(g["title"])["slug"], g["slug"])
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
                self.assertTrue(all(r["slug"] != "frontend-developer" for r in d["related"]))

    def test_frontend_developer_is_left_to_its_own_guide(self):
        self.assertIsNone(tech_guide("Frontend Developer"))
