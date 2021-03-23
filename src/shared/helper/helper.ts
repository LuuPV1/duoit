import { axios } from "../../App";

export function formatDate(string: string) {
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(string).toLocaleDateString([], options);
}

export const addPostToFavorite = async (slug: string) => {
  axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('realWorldUser')}`
  try {
    return await axios.post(`/articles/${slug}/favorite`,{});
  }
  catch(error){
    console.log(error);
  }
}

export const deletePostFromFavorite = async (slug: string) => {
  axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('realWorldUser')}`
  try {
    return await axios.delete(`/articles/${slug}/favorite`,{});
  }  
  catch(error){
    console.log(error);
  }
}
