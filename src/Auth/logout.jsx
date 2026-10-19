export default function Logout() {
    localStorage.removeItem("access_token");
    //console.log(localStorage.getItem("access_token"));
    window.location.href = "/login";
    return null;
}