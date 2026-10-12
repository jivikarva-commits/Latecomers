import asyncio
from unittest import TestCase
from unittest.mock import patch

import data_routes
from career_catalog import ALLOWED_CAREER_SLUGS
from finance_guides import GUIDES, finance_guide

MENU = ["Accounts Executive (Tally/GST)", "GST Practitioner", "Income Tax Consultant", "Financial Analyst", "Investment Banker (Analyst)",
        "Stock Market Trader / Analyst", "Mutual Fund Advisor", "SAP FICO Consultant", "Financial Modeler",
        "CA (Chartered Accountant)", "CMA (Cost Accountant)", "CS (Company Secretary)", "ACCA", "CFA"]


class FinanceGuidesTest(TestCase):
    def test_every_menu_role_has_a_guide(self):
        for title in MENU:
            with self.subTest(title=title):
                self.assertIsNotNone(finance_guide(title))

    def test_slugs_resolve_without_ai(self):
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                self.assertIn(g["slug"], ALLOWED_CAREER_SLUGS)
                with patch.object(data_routes, "db", side_effect=AssertionError("no db")), \
                     patch.object(data_routes, "_start_career_detail_generation", side_effect=AssertionError("no AI")):
                    detail = asyncio.run(data_routes._get_career_detail_by_slug(g["slug"], None))
                self.assertFalse(detail["detailsGeneratedByAI"])
                self.assertEqual(detail["category"], "Finance")

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
                self.assertTrue(d["institutes"])
                self.assertTrue(all(i["url"].startswith("https://") for i in d["institutes"]))
                self.assertGreaterEqual(len(d["faqs"]), 3)
                self.assertTrue(all(r["slug"] in slugs for r in d["related"]))
                self.assertTrue(d["extraSections"])
                self.assertEqual(d["labels"]["back"][0], "/careers-explore?field=finance")
                if g["tags"][1] == "Accounting & Finance Jobs":
                    self.assertTrue(4 <= len(d["institutes"]) <= 5)
