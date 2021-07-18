export type TrackImage = {
    height: number;
    url: string;
    width: number;
}

export const randomTrackImage = (): TrackImage => {
    return {
        height: 0,
        url: "",
        width: 0,
    };
};