import http from "../index.ts";

const options = {
    searchMusic: async (data) => await http.get('/b/vk_auth.php', data), // slider search
    similarSinger: async (data) => await http.get(`/b/similar/artist/${data}`),
    yybaidu: async (data) => await http.get(`/y/api/yybaidu?key=${data.key}&msg=${data.msg}`,)
}
export default options