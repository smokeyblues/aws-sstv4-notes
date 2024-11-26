import { Resource } from "sst";
import { Example } from "@aws-sstv4-notes/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
