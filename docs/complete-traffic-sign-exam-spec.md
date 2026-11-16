# Complete Saudi traffic-sign and road-device learning and exam specification

## Product requirement

The platform must teach and test the learner on the complete Saudi road-sign and traffic-control-device inventory applicable to the current Saudi Highway Code, not merely a small sample of common signs. The target is full catalogue coverage with traceable evidence. A question-count target alone is not evidence of completeness.

Primary technical reference:
- Saudi Roads General Authority, Saudi Highway Code SHC 602 — Manual on Uniform Traffic Control Devices, 2023, 1st Edition.
- Official PDF: https://istitlaa.scbc.gov.sa/ar/transportation/mot/saudihighwaycode/Documents/SHC%20602%20final.pdf
Legal reference:
- Saudi Traffic Law and its attached traffic signs / road markings provisions: https://laws.boe.gov.sa/BoeLaws/Laws/LawDetails/85364e57-c01e-41ba-8def-a9a700f183e9/1

The Saudi legal source determines local legal meaning. SHC 602 supplies the detailed technical catalogue. International sources may clarify general safety concepts only; they must never silently replace Saudi rules.

## Scope — no category may be silently omitted

1. Regulatory signs: priority, stop/yield, speed limits, lane and movement controls, prohibited movements, entry restrictions, vehicle dimensions/weights, parking/stopping/waiting, public transport, cycle/pedestrian restrictions, and supplementary plates.
2. Warning signs: alignment, grades, narrowing, bridges/tunnels, surface hazards, weather/environment, intersections, signals, merging/lane drops, roundabouts, U-turns, vulnerable road users, animals, obstacles, and other hazards.
3. Guide / informative signs: route shields, destinations, directions, distances, exits/interchanges, services, facilities, tourist/cultural destinations, toll roads, managed lanes, dynamic messages and emergency information.
4. Road and pavement markings: longitudinal and transverse lines, lane-use arrows, words/symbols, stop/yield lines, crosswalks, parking/curb markings, islands, hatching, channelisation, coloured pavement, raised markers, delineators and rumble strips.
5. Traffic signals: vehicle indications, arrows, flashing modes, lane-control signals, pedestrian indications, accessible/audio/tactile features, hybrid beacons, and emergency-vehicle signal access where covered by the Saudi code.
6. Special locations: school zones, pedestrian and bicycle facilities, managed lanes, rest areas, truck inspection facilities, rural zones and rail/light-rail crossings where included in the Saudi source.
7. Work zones and temporary control: temporary regulatory/warning/information signs, temporary markings, cones, drums, barriers, delineators, arrow panels, warning lights, flagger signals and one-way work-zone control.
8. Appendices and additional signs: reconcile every catalogue entry in Appendices A–H against the relevant chapter inventory. Duplicates are linked to one canonical record with all source references, not discarded.

## Source-of-truth inventory and traceability

Use `docs/shc602-inventory-coverage.md` as the chapter/page map. It is an index, not proof that every individual device has been captured.

Create and maintain a canonical inventory with one record per distinct sign, sign variant, marking pattern, signal indication or temporary traffic-control device. Every record must include:
- stable ID and device type;
- Saudi jurisdiction / applicability;
- official code and exact source title;
- Arabic learner-facing name and English source title;
- class, subgroup, chapter, section, printed page, figure/table;
- verified image/figure reference and image-rights status;
- plain-Arabic meaning;
- exact driver response, including what must not be done;
- safety reason and a realistic road context;
- supplementary plate / variation rules;
- source URL, source edition, date checked and source excerpt/page;
- legal classification (Saudi legal requirement, technical standard/guidance, or general safety principle);
- review state, reviewer, review date and change history.

No record can be marked publishable using only a table-of-contents title. Inspect the original figure and surrounding explanatory text. If the official PDF's figure is not reusable, create an original diagram that accurately represents it and record its provenance; do not copy commercial app artwork or protected question banks.

## Coverage gates — release must fail closed

Track counts by chapter, category, code, variant and source appendix:
- `source_entries`: all entries identified in chapters and appendices;
- `canonical_devices`: unique devices after documented duplicate reconciliation;
- `verified_devices`: entries with verified figure and source text;
- `arabic_explanations_complete`;
- `driver_actions_complete`;
- `rights_cleared_assets`;
- `reviewed_devices`;
- `question_coverage`.

A category is not complete until every source entry is either mapped to a reviewed canonical device or explicitly marked as a documented duplicate / non-learner-facing technical item with a reason. Unknown and unreviewed entries remain visible as gaps. Never display a fabricated percentage or claim “all signs” while any unresolved gap remains.

## Learning card requirements

Each learner-facing device card must show:
- clear image or original explanatory diagram;
- Arabic name and official code (where one exists);
- category and source reference;
- what it means in simple Arabic;
- what the driver must do immediately and afterward;
- common dangerous misunderstanding;
- short real-world scenario;
- distinction from visually similar signs / markings where relevant.

Support Arabic RTL and accessible text descriptions. Do not rely on colour alone to communicate meaning.

## Exam requirements

The assessment system must test every approved canonical device, not just the first 60 random questions.

Required modes:
1. **All-device mastery test:** a coverage-driven assessment that ensures every approved device is assessed at least once across the learner's mastery journey. For very large inventories, split into numbered parts without omitting entries.
2. **Category tests:** separate regulatory, warning, guide, road-marking, signal, special-zone and work-zone assessments.
3. **Mixed mock exam:** balanced randomized sampling from all categories, with no repeated question in a single attempt unless explicitly configured.
4. **Image recognition:** identify the sign/marking/signal from its image, including visually similar distractors.
5. **Action-in-context:** choose the safe and lawful response in a short road scenario, not merely name the sign.
6. **Mistake review:** repeat incorrect items and schedule later re-testing until mastery.
7. **Variant coverage:** where a code has distinct meaningful variants (direction, speed, vehicle class, supplementary plate, signal state), each variant receives an appropriate question or explicitly linked variant question.

Every question must link to one or more canonical inventory IDs and source references. Store question provenance and review state. Questions must be original, technically correct, and reviewed. Do not claim these are the official live licensing-exam questions or guarantee a pass.

## Data model and implementation guidance

Prefer a normalized inventory model rather than embedding the whole catalogue in a hard-coded quiz array:
- TrafficDevice: canonical device identity, code, category, status.
- TrafficDeviceVariant: meaningful variation and its relationship to the canonical device.
- TrafficDeviceSource: chapter/section/page/figure and source edition.
- TrafficDeviceAsset: image/diagram, rights and provenance.
- TrafficDeviceTranslation: Arabic and English labels/explanations.
- TrafficDeviceAction: required action, prohibited action and safety rationale.
- TrafficDeviceQuestion: original question, answer choices, explanation, difficulty and review status.
- TrafficDeviceQuestionLink: many-to-many mapping between questions and inventory devices.
- LearnerDeviceMastery: per-user mastery, attempts, last seen and next review.
- ContentReview: reviewer, decision, timestamp and change history.

Use existing project conventions and Prisma schema; inspect before changing. Migrations must be additive and safe. Never reset the database or erase learner progress. Seed scripts must be idempotent and use stable IDs/upserts.

## Test and acceptance criteria

- Automated integrity test: every published device has a source, verified explanation, driver action, rights-cleared asset, review approval and at least one linked question.
- Inventory reconciliation test: every chapter and Appendix A–H entry in the source map has a disposition.
- Coverage test: every approved device is represented in the all-device mastery plan.
- Variant test: every required variant is tested or has a documented reason for exclusion.
- Randomization test: no unintended duplicate questions in one attempt; category distribution is enforced.
- Regression tests: scoring, saved attempts, progress, authentication and existing lessons remain intact.
- Editorial QA: a qualified Saudi traffic-safety reviewer verifies legal meaning and safe driver actions before production publication.

## Delivery phases

1. Extract and reconcile the full SHC 602 chapter and appendix catalogues into a structured inventory.
2. Verify each individual entry against its source figure and surrounding text; resolve duplicate codes and variants.
3. Create rights-cleared visual assets and reviewed Arabic teaching cards.
4. Build the normalized database/API and safe idempotent import.
5. Generate original, source-linked questions for every approved device.
6. Build all-device mastery, category tests, mixed mocks, image recognition and mistake review.
7. Run coverage gates and editorial QA; publish only verified content.
8. Continue monitoring official revisions and record every source/version update.

## Current status

This specification is a product and engineering acceptance contract. It does not claim that the complete catalogue, assets, questions, database import, or editorial review already exist. The current inventory map is only a starting index; completion must be demonstrated by the reconciliation and automated coverage reports above.
