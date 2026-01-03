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

export const getUserById = graphql(`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
    }
  }
`);

export const getTournamentsEventsPageInfo = graphql(`
  query GetTournamentsEventsPageInfo($userId: ID!) {
    user(id: $userId) {
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
  query GetTournamentsEventsStartAt($userId: ID!, $page: Int!) {
    user(id: $userId) {
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
  query GetUserInfo($userId: ID!) {
    user(id: $userId) {
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
        phaseGroups {
          bracketType
        }
        checkInSeed {
          seedNum
        }
        standing {
          placement
        }
      }
    }
  }
`);
