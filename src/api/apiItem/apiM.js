import http from "../index.ts";

const options = {
    searchMusic : async (data) => await http.get('/b/vk_auth.php',data), // slider search
    similarSinger: async (data) => await http.get(`/b/similar/artist/${data}`),
}
export default options