import request from "supertest";
import express from "express";
import { HttpStatuses } from "../src/core/types/http-statuses";
import { setupApp } from "../src/setup-app";
import { videoInputDto } from "../src/videos/dto/video.input-dto";
import { AvailableResolutions } from "../src/videos/types/video";
import { videoUpdateDto } from "../src/videos/dto/video.update-dto";

describe("Videos API testing", () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatuses.NO_CONTENT_204);
  });

  //post video
  it("Should create a video with correct data", async () => {
    const newVideo: videoInputDto = {
      author: "Mikhail",
      availableResolutions: [AvailableResolutions.P144],
      title: "Test",
    };
    const newVideo2: videoInputDto = {
      author: "Mikhail",
      availableResolutions: [AvailableResolutions.P720],
      title: "Test2",
    };

    await request(app)
      .post("/videos")
      .send(newVideo)
      .expect(HttpStatuses.CREATED_201);

    await request(app)
      .post("/videos")
      .send(newVideo2)
      .expect(HttpStatuses.CREATED_201);
  });
  //id of the video
  let videoId = 0;

  // get all videos
  it("Should return status code 200 with array of all existing videos", async () => {
    const responseAllVideos = await request(app)
      .get("/videos")
      .expect(HttpStatuses.OK_200);

    expect(responseAllVideos.body).toBeInstanceOf(Array);
    expect(responseAllVideos.body).toHaveLength(2);

    videoId = responseAllVideos.body[0].id;
  });
  //get by id
  it("Should return video by Id", async () => {
    const responseVideoById = await request(app)
      .get("/videos/" + videoId)
      .expect(HttpStatuses.OK_200);

    expect(responseVideoById.body).toEqual({
      id: videoId,
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      author: "Mikhail",
      availableResolutions: [AvailableResolutions.P144],
      title: "Test",
    });
  });
  //update
  it("Should return updated video", async () => {
    const updatedInfo: videoUpdateDto = {
      author: "Jack",
      availableResolutions: [
        AvailableResolutions.P144,
        AvailableResolutions.P720,
      ],
      canBeDownloaded: false,
      minAgeRestriction: 37,
      publicationDate: new Date(),
      title: "Naked",
    };
    await request(app)
      .put("/videos/" + videoId)
      .send(updatedInfo)
      .expect(HttpStatuses.NO_CONTENT_204);

    const responseVideoById = await request(app)
      .get("/videos/" + videoId)
      .expect(HttpStatuses.OK_200);

    expect(responseVideoById.body).toEqual({
      id: videoId,
      canBeDownloaded: false,
      minAgeRestriction: 37,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      author: "Jack",
      availableResolutions: [
        AvailableResolutions.P144,
        AvailableResolutions.P720,
      ],
      title: "Naked",
    });
  });

  //delete
  it("Should delete video by Id", async () => {
     await request(app)
      .delete("/videos/" + videoId)
      .expect(HttpStatuses.OK_200);

    await request(app)
      .get("/videos/" + videoId)
      .expect(HttpStatuses.NOT_FOUND_404);
  });
});
