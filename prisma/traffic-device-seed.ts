import { PrismaClient } from "@prisma/client";
import { devices, officialReferences } from "../lib/traffic-devices";

const prisma = new PrismaClient();

async function main() {
  for (const device of devices) {
    const data = {
      group: device.group,
      title: device.title,
      meaning: device.meaning,
      action: device.action,
      context: device.context,
      shape: device.shape,
      question: device.question,
      choices: device.choices,
      answer: device.answer,
      explanation: device.explanation,
      officialReference: officialReferences[device.id] ?? null,
      status: "published"
    };
    await prisma.trafficDevice.upsert({
      where: { id: device.id },
      update: data,
      create: { id: device.id, ...data }
    });
  }
  console.log(`Seeded ${devices.length} traffic-device learning records.`);
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
