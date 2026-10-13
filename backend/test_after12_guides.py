import asyncio
from unittest import TestCase
from unittest.mock import patch

import data_routes
from after12_guides import ALIASES, GUIDES
from career_catalog import ALLOWED_CAREER_SLUGS

MENU = ["Makeup Artist", "Mehendi Artist", "Hair Stylist", "Nail Art Technician", "Reels / Video Editor", "Graphic Designer", "Data Entry Operator",
        "Tally Accountant", "Electrician", "Mobile Repair Technician", "AC Repair Technician", "CCTV Installer", "Automobile Technician", "Yoga Instructor",
        "Fitness Trainer", "SEO Executive", "Social Media Executive", "Cabin Crew", "Airport Ground Staff", "Hotel Front Desk Staff", "Medical Coder",
        "Lab Technician", "WordPress Developer", "Junior Android Developer", "Photo/Video Editor", "Drone Pilot", "Interior Design Assistant",
        "CNC Machine Operator", "Army Soldier (GD / Technical / Clerk)", "NDA Officer", "Police Constable — State Recruitment",
        "SSC CHSL — LDC / JSA / DEO", "Railway Level 1 — Track Maintainer / Assistants", "SSC MTS"]


class After12GuidesTest(TestCase):
    def test_every_menu_title_opens_a_curated_guide(self):
        for title in MENU:
            with self.subTest(title=title), patch.object(data_routes, "db", side_effect=AssertionError("no db")):
                result = asyncio.run(data_routes.generate_career(data_routes.CareerGenerateRequest(title=title), None))
                self.assertTrue(result.get("guideProfile") or result.get("governmentProfile"), title)

    def test_aliases_point_to_existing_guides(self):
        for alias, target in ALIASES.items():
            with self.subTest(alias=alias):
                self.assertIsNotNone(data_routes._curated_guide(target))
                self.assertEqual(data_routes._curated_guide(alias)["slug"], target)

    def test_new_guides_structure(self):
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                self.assertIn(g["slug"], ALLOWED_CAREER_SLUGS)
                d = g["guideProfile"]["details"]
                self.assertEqual(d["steps"][0]["title"], "Education requirement")
                self.assertGreaterEqual(len(d["institutes"]), 2)
                self.assertGreaterEqual(len(d["faqs"]), 3)
                self.assertTrue(all(data_routes._curated_guide(r["slug"]) for r in d["related"]), [r["slug"] for r in d["related"]])
                self.assertEqual(d["labels"]["back"][0], "/careers-explore?field=after12")
