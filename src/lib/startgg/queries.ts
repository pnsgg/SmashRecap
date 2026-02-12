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
        prefix
        gamerTag
        user {
          id
          slug
          location {
            country
          }
          images(type: "profile") {
            url
          }
          events(query: { sortBy: "startAt DESC" }) {
            pageInfo {
              total
            }
          }
        }
      }
    }
  }
`);

export const getUserBySlug = graphql(`
  query GetUserBySlug($slug: String!) {
    user(slug: $slug) {
      id
      slug
    }
  }
`);

export const getTournamentsEventsPageInfo = graphql(`
  query GetTournamentsEventsPageInfo($slug: String!) {
    user(slug: $slug) {
      events(
        query: {
          filter: { videogameId: [1386], eventType: 1, past: true, upcoming: false }
          sortBy: "startAt DESC"
        }
      ) {
        pageInfo {
          total
          totalPages
        }
      }
    }
  }
`);

export const getPaginatedTournamentsEventsStartAt = graphql(`
  query GetTournamentsEventsStartAt($slug: String!, $page: Int!) {
    user(slug: $slug) {
      events(
        query: {
          filter: { videogameId: [1386], eventType: 1 }
          sortBy: "startAt DESC"
          page: $page
        }
      ) {
        nodes {
          id
          startAt
        }
      }
    }
  }
`);

export const getUserInfo = graphql(`
  query GetUserInfo($slug: String!) {
    user(slug: $slug) {
      id
      images(type: "profile") {
        url
      }
      genderPronoun
      player {
        prefix
        gamerTag
      }
      location {
        country
      }
      authorizations {
        type
        externalUsername
      }
    }
  }
`);

export const getEvent = graphql(`
  query GetEvent($eventId: ID!, $userId: ID!) {
    event(id: $eventId) {
      tournament {
        images(type: "profile") {
          url
        }
        name
        numAttendees
        startAt
        city
      }
      userEntrant(userId: $userId) {
        id
        phaseGroups {
          bracketType
        }
        checkInSeed {
          seedNum
        }
        standing {
          placement
        }
        paginatedSets {
          pageInfo {
            total
            totalPages
          }
          nodes {
            fullRoundText
            displayScore
            winnerId
            games {
              winnerId
              selections {
                entrant {
                  id
                  name
                  players {
                    id
                    gamerTag
                    user {
                      images(type: "profile") {
                        url
                      }
                    }
                  }
                  checkInSeed {
                    seedNum
                  }
                }
                character {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`);

export const getEntrant = graphql(`
  query GetEntrant($entrantId: ID!) {
    entrant(id: $entrantId) {
      id
      players {
        prefix
        gamerTag
        user {
          images(type: "profile") {
            url
          }
        }
      }
    }
  }
`);
