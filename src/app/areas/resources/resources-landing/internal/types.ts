export type ResourceApiItemModel = { id: string; title: string; url: string };

export type ResourceApiCreateModel = Omit<ResourceApiItemModel, 'id'>;
