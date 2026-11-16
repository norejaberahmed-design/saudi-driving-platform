# Saudi Traffic Safety Curriculum — Product Specification

Status: foundation specification; content is not approved for learner publication until each entry has a verified source and editorial review.

## Product objective

Build a Saudi-focused, Arabic-first learning platform that teaches safe road use, explains the meaning and required response for traffic-control devices, prepares learners for theoretical driving tests, and provides carefully sourced guidance about licensing procedures.

The platform is educational and independent. It does not issue licences, represent a government agency, reproduce confidential exam questions, or guarantee passing an official test.

## Authoritative classification

Use the Saudi legal and road-control terminology as the primary taxonomy:

1. **Warning signs (إشارات تحذيرية):** alert road users to existing or potential hazards.
2. **Regulatory signs (إشارات تنظيمية):** communicate rules, restrictions and prohibitions. Their subgroups include right-of-way controls (STOP and GIVE WAY), speed, permitted/prohibited movements, parking/stopping, and mandatory signs.
3. **Guide / information signs (إشارات إرشادية / إعلامية):** identify routes, destinations, distances, directions, facilities and points of interest.
4. **Work-zone and temporary traffic-control devices (إشارات وأجهزة مناطق العمل والتحويلات المؤقتة):** temporary signs, markings, cones, barriers, channelising devices, arrow boards and flagger controls.
5. **Road markings and delineation (علامات الطريق والعاكسات):** lane lines, edge lines, stop lines, pedestrian crossings, arrows, hatching, raised markers and related devices.
6. **Traffic signals (الإشارات الضوئية):** vehicle, pedestrian and special-purpose signal aspects and their safe response.

Do not create an independent official category called “optional signs”. Explain optional/advisory information only where a Saudi source defines it. “Mandatory” is a subgroup of regulatory signs, not a peer category. Keep user-facing aliases searchable without misrepresenting the legal taxonomy.

## Required sign record

Every sign/device record must contain:
- Stable internal ID and Arabic display name; English name where verified.
- Official class and subgroup.
- Original approved image or vector illustration with source/licence metadata.
- Meaning and purpose in plain Arabic.
- What the driver must do, what must not be done, and the safety reason.
- Typical placement/context, including any supplementary plate.
- Related road-marking or signal records.
- Source URL, publisher, document/version, relevant section/page/article, last-checked date.
- Review status: draft, source-checked, traffic-reviewed, published, retired.
- Change history and reviewer attribution.

Never publish an invented sign, an image copied without usage rights, or a legal interpretation without a traceable source. If the official annex image cannot be obtained or its usage rights are unclear, use a newly drawn explanatory illustration that does not pretend to be an official reproduction.

## Learning and assessment

- Browse and filter the full catalogue by class, subgroup, shape, colour, name and driving situation.
- Sign detail pages teach recognition, meaning, action and risk.
- Learning paths cover road rules, priority, intersections, roundabouts, speed, lane discipline, overtaking, parking, pedestrian safety, emergency vehicles, adverse weather, night driving, vehicle readiness, breakdowns and collision response.
- Question bank supports single-choice, multiple-select where appropriate, image recognition, scenario-based questions and hazard-perception sequences.
- Every question has a source, explanation, difficulty, topic tags, review status and version.
- Assessment modes: topic practice, mixed practice, timed mock test, sign-only test, road-marking test, scenario test and cumulative revision.
- The server selects questions and grades attempts; never expose correct answers before submission.
- Explain why the correct answer is safe and why each distractor is unsafe or incorrect.
- Track learner performance by topic and recommend targeted revision.
- Readiness score is an internal learning indicator only; never present it as an official pass probability or official exam score.

## Editorial and safety controls

- Separate binding legal requirements from recommended safe-driving practice.
- Display the source and last-verified date for legal and procedural guidance.
- Recheck official content on a scheduled editorial cycle and when source documents change.
- Keep outdated content retired but auditable.
- Require two-person review for legal interpretations and high-risk safety guidance before publication.
- Provide a report-an-error path and maintain a correction log.
- Avoid absolutes when road context, signage, police directions or temporary controls may change the correct action.

## Initial official source register

- Bureau of Experts, Council of Ministers — Saudi Traffic Law and its attached traffic-sign material:
  https://laws.boe.gov.sa/BoeLaws/Laws/LawDetails/85364e57-c01e-41ba-8def-a9a700f183e9/1
- Saudi Road Code — Traffic Control Devices Code (SHC 602), official Road General Authority publication route:
  https://istitlaa.ncc.gov.sa/ar/Transportation/Mot/SaudiHighwayCode/Pages/default.aspx
- National Center for Competitiveness consultation page — Guide to Traffic Control and Calming Devices (use as a discovery/source route; verify final adopted status before treating as binding):
  https://istitlaa.scbc.gov.sa/ar/Municipality/momra/Traffic/Pages/default.aspx

A source being hosted on an official or consultation domain does not automatically mean every draft is currently binding. Record document status and version before using it for legal instruction.

## Definition of done

The curriculum is not complete merely because a category page exists. A release candidate must demonstrate:
- A traceable inventory of every sign/device included in the applicable Saudi source annexes and manuals.
- No duplicate IDs, missing images, broken sources or unreviewed published records.
- Coverage checks across every class and subgroup.
- Test coverage for every sign class, road markings, signals and core safety topics.
- Server-side grading, secure answer handling, durable attempt history and learner progress.
- Arabic RTL mobile usability, accessibility checks and performance checks.
- Human review by a qualified Saudi traffic-safety/driver-training reviewer before public release.
