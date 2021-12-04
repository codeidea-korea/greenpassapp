import { parse } from "graphql";

const config  = {
    screens: {
        Feed: {
          path: 'Feed',
          screens: {
              Photo: {
                  path: 'Photo',
                  parse: { photoId: (id) => `${id}` },        
              },
          },
        },    
      },
};

const linking = {
    prefixes: ["greenpassapp://"],
    config ,
}

export default linking;