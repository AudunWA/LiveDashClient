export const layout = {
    id: "preset-empty",
    name: "Empty",
    description: "This preset gives you an empty grid, perfect if you know exactly what you want to look at.",
    mobileModules: [
        {
            type: "ImageModule",
            gridArea: "header",
            src: "res/revolve_logo1.png"
        },
        {
            type: "YouTubeModule",
            gridArea: "video",
            src: "https://www.youtube-nocookie.com/embed/1GGnX-p9jFg?autoplay=0"
        }
    ],
    desktopModules: [
        {
            type: "ImageModule",
            gridArea: "header",
            src: "res/revolve_logo1.png"
        },
        {
            type: "YouTubeModule",
            gridArea: "2 / 2 / 5 / 6",
            src: "https://www.youtube-nocookie.com/embed/1GGnX-p9jFg?autoplay=0"
        }
    ]
};