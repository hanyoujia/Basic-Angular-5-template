export class Video {
    created_at: string;
    description: string;
    duration: string;
    height: string;
    id: string;
    play_count: number;
    thumbnail_url: string;
    image_url: string;
    title: string;
    url: string;
    version: string;
    width: number;

    public static formatVideo(videoRawStr): any {
        const v: Video = new Video();

        // TODO: The date format need to depends the language passed in
        // this should be done in a angular directive
        const dateObj = new Date(Date.parse(videoRawStr.created_at[0]));
        let month: any = dateObj.getUTCMonth() + 1; // months from 1-12
        let day: any = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        v.created_at = month + '/' + day + '/' + year;

        v.description = videoRawStr.description[0];
        v.duration = videoRawStr.duration[0];
        v.height = videoRawStr.height[0];
        v.id = videoRawStr.id[0];
        v.play_count = videoRawStr.play_count[0];
        v.thumbnail_url = videoRawStr.thumbnail_url[0];
        v.title = videoRawStr.title[0];
        v.url = videoRawStr.url[0];
        v.version = videoRawStr.version[0];
        v.width = videoRawStr.width[0];

        // not exposed in current playlist API
        v.image_url = v.thumbnail_url.replace('/thumb', '/image');

        return v;
    }
}

