import asyncio
from unittest import TestCase
from unittest.mock import patch

import data_routes
from career_catalog import ALLOWED_CAREER_SLUGS
from design_film_guides import GUIDES, design_guide

MENU = ["Graphic Designer", "Brand Identity Designer", "Packaging Designer", "UI Designer", "UX Designer / Researcher", "Product Designer",
        "Video Editor", "Motion Graphics Designer", "Color Grading Artist", "Reels / Short Form Editor", "2D / 3D Animator", "VFX Artist",
        "Game Designer", "Game Developer (Unity/Unreal)", "AR/VR Developer", "Commercial Photographer", "Cinematographer / DOP", "Film Director",
        "Drone Photographer / Videographer"]


class DesignGuidesTest(TestCase):
    def test_every_menu_role_has_a_guide(self):
        self.assertEqual(len(GUIDES), len(MENU))
        for title in MENU:
            with self.subTest(title=title):
                self.assertIsNotNone(design_guide(title))

    def test_slugs_resolve_without_ai(self):
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                self.assertIn(g["slug"], ALLOWED_CAREER_SLUGS)
                with patch.object(data_routes, "db", side_effect=AssertionError("no db")), \
                     patch.object(data_routes, "_start_career_detail_generation", side_effect=AssertionError("no AI")):
                    detail = asyncio.run(data_routes._get_career_detail_by_slug(g["slug"], None))
                self.assertFalse(detail["detailsGeneratedByAI"])
                self.assertEqual(detail["category"], "Design")

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
                self.assertGreaterEqual(len(d["institutes"]), 3)
                self.assertTrue(all(i["url"].startswith("https://") for i in d["institutes"]))
                self.assertGreaterEqual(len(d["faqs"]), 3)
                self.assertTrue(all(r["slug"] in slugs for r in d["related"]))
                self.assertEqual([x["id"] for x in d["extraSections"]], ["tools", "typical-day", "projects", "interview-questions", "ways-to-earn"])
                self.assertEqual(d["labels"]["back"][0], "/careers-explore?field=design")
