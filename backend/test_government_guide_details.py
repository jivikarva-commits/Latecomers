from unittest import TestCase

from government_careers import GUIDES, government_career

REQUIRED = ["service", "quickFacts", "role", "examStages", "passingRules", "steps", "prepPlan", "freeResources", "mistakes", "faqs", "related"]


class GovernmentGuideDetailsTest(TestCase):
    def test_every_government_guide_has_a_start_to_end_structure(self):
        slugs = {g["slug"] for g in GUIDES}
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                d = government_career(g["slug"])["governmentProfile"]["details"]
                for key in REQUIRED:
                    self.assertTrue(d.get(key), key)
                self.assertTrue(d.get("eligibility") or g["eligibility"])
                self.assertGreaterEqual(len(d["steps"]), 5)
                self.assertTrue(all(s["title"] and s["when"] and s["detail"] for s in d["steps"]))
                self.assertTrue(all(st["name"] and st["passRule"] for st in d["examStages"]))
                self.assertTrue(all(r["slug"] in slugs for r in d["related"]), "related links must point to real guides")
                self.assertTrue(all(r["url"].startswith("https://") for r in d["freeResources"]))
                self.assertEqual(len({r["url"] for r in d["freeResources"]}), len(d["freeResources"]))
                ladder = d.get("careerLadder")
                if ladder and ladder.get("columns"):
                    self.assertTrue(all(len(row) == len(ladder["columns"]) for row in ladder["rows"]))
                if d.get("categoryTable"):
                    t = d["categoryTable"]
                    self.assertTrue(all(len(row) == len(t["columns"]) for row in t["rows"]))

    def test_detailed_guides_cite_an_official_source_first(self):
        for g in GUIDES:
            with self.subTest(slug=g["slug"]):
                sources = government_career(g["slug"])["governmentProfile"]["sources"]
                self.assertEqual(sources[0]["kind"], "official")
                self.assertEqual(len({s["url"] for s in sources}), len(sources))
