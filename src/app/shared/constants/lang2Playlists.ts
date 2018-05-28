export class Lang2Playlists {
    public static sourceMap: Map<string, string> = new Map<string, string>([
        ['en', '18256.xml'], ['ru', '18257.xml'], ['ar', '18258.xml'],
        ['fr', '18259.xml'], ['cs', '18260.xml']]);

    public static getFeedId(lang: string): string {
        if (typeof lang === 'undefined') {
            return Lang2Playlists.sourceMap.get('en');
        }

        let feed = Lang2Playlists.sourceMap.get(lang);
        if (typeof feed === 'undefined') {
            feed = Lang2Playlists.sourceMap.get('en');
        }
        return feed;
    }

}
