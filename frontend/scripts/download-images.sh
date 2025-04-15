#!/bin/bash

# Create the directory if it doesn't exist
mkdir -p public/event-images

# Download sample images
curl "https://source.unsplash.com/800x600/?campus,event" -o public/event-images/event1.jpg
curl "https://source.unsplash.com/600x800/?student,activity" -o public/event-images/event2.jpg
curl "https://source.unsplash.com/900x600/?university,celebration" -o public/event-images/event3.jpg
curl "https://source.unsplash.com/700x800/?college,party" -o public/event-images/event4.jpg
curl "https://source.unsplash.com/600x700/?graduation,ceremony" -o public/event-images/event5.jpg
curl "https://source.unsplash.com/800x700/?campus,life" -o public/event-images/event6.jpg

echo "Images downloaded successfully!" 