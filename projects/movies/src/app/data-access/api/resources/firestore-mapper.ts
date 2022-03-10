export const mapDocument = (genre: any) => {
  const fields = genre.fields;
  const result = Object.keys(fields).reduce((acc, key) => {
    acc[key] = fields[key][Object.keys(fields[key])[0]];
    return acc;
  }, {} as any);
  return result;
};

export const mapDocuments = (genres: any) => genres.documents.map(mapDocument);