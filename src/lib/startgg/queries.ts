import { graphql } from '$lib/graphql';

export const GetAuthenticatedUserQuery = `
	query GetAuthenticatedUser {
		currentUser {
			id
		}
	}
`;

export const searchPlayerByGamerTag = graphql(`
  query SearchPlayerByGamerTag($query: PlayerQuery!) {
    players(query: $query) {
      nodes {
        gamerTag
        user {
          id
          location {
            country
          }
          images(type: "profile") {
            url
          }
        }
      }
    }
  }
`);
