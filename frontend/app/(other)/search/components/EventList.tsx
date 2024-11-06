import React from "react";
import EventDisplay from "./EventDisplay";
import { Event } from "@/config/dbtypes";

export default function EventList() {
  let event: Event = {
    title: "Aggie Events Meeting!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem consequatur distinctio earum ex nisi praesentium\n" +
      "      recusandae reiciendis ullam velit voluptas. Commodi cumque ducimus esse magni modi provident, quae ratione rem! Ab\n" +
      "      aliquid architecto asperiores consectetur consequatur corporis cupiditate deserunt est facere incidunt inventore\n" +
      "      ipsa ipsam magnam modi necessitatibus nobis officia pariatur placeat, quas qui quisquam quod repellendus sed\n" +
      "      similique soluta ullam, voluptatem! Asperiores consequatur culpa delectus deserunt dicta dolor doloremque, dolores\n" +
      "      earum eveniet in incidunt nam natus perspiciatis. Autem eaque eligendi excepturi iste minus sunt ullam velit.\n" +
      "      Illum modi molestiae necessitatibus odio odit ratione sunt tenetur totam. Alias dolorem excepturi facilis hic\n" +
      "      inventore quam similique, temporibus tenetur veniam. A, architecto aspernatur cum doloribus eligendi id illo\n" +
      "      incidunt magnam molestiae, neque nisi rerum sed sit temporibus tenetur voluptatibus voluptatum? Ad architecto\n" +
      "      aspernatur cum deleniti deserunt doloribus earum eligendi exercitationem facilis hic in iste nesciunt nostrum\n" +
      "      obcaecati odit optio quam quos, voluptatibus.",
    location: "ZACH 461",
    date: new Date(),
    link: "https://tamu.edu",
    time: "All-day",
  };
  return (
    <div className="flex flex-col gap-3 my-2">
      <EventDisplay event={event} />
      <EventDisplay event={event} />
      <EventDisplay event={event} />
      <EventDisplay event={event} />
      <EventDisplay event={event} />
      <EventDisplay event={event} />
      <EventDisplay event={event} />
    </div>
  );
}
