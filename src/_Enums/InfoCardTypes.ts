export const InfoCardTypes = {
    FAV_COLOR: "FAV_COLOR",
    FAV_ANIMAL: "FAV_ANIMAL",
    HOBBY: "HOBBY",
    PASSION: "PASSION",
    FAV_GAMES: "FAV_GAMES",
} as const;

export type InfoCardTypes = keyof typeof InfoCardTypes;