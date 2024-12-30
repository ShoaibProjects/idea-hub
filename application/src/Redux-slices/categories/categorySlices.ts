import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const initialState = {
  // categories: ['Technology','Science','Politics and World','Business idea','Education','Health','Finance','Art','Bio and Medicine','Governance',
  //              'Society','New Food Recipe','Joke','Poem','Plan/Strategy','Music','Song','Product idea','Service idea','Saas idea','Startup idea','Open Source','App ideas','Book ideas',
  //              'Video ideas','Post ideas','Reels/Shorts ideas','Movie idea','Ideas to improve the World','Solution to a Problem','Self Rules',
  //              'Self Realizations','Self improvement Goals/Ideas','Invention','Innovation','Other'
  // ],
  categories: [
    "Food",
    "Health and Medicine",
    "Education & Research",
    "Invention/Innovation",
    "Entertainment & Media",
    "Startup/Bussiness",
    "Saas/app ideas",
    "Music/Song",
    "Art & Creativity",
    "Solution of a Problem",
    "Plan/Strategy",
    "Other",
  ],
};

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
});

export const selectCategories = (state: RootState) =>
  state.categories.categories;

export default categorySlice.reducer;
