import {GraphQLBoolean, GraphQLID, GraphQLNonNull} from 'graphql';
import getRethink from 'server/database/rethinkDriver';
import {requireTeamMember} from 'server/utils/authorization';
import UpdateTeamMemberPayload from 'server/graphql/types/UpdateTeamMemberPayload';
import getPubSub from 'server/utils/getPubSub';
import {TEAM_MEMBER, UPDATED} from 'universal/utils/constants';

export default {
  type: UpdateTeamMemberPayload,
  description: 'Check a member in as present or absent',
  args: {
    teamMemberId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The global teamMemberId of the person who is being checked in'
    },
    isCheckedIn: {
      type: GraphQLBoolean,
      description: 'true if the member is present, false if absent, null if undecided'
    }
  },
  async resolve(source, {teamMemberId, isCheckedIn}, {authToken, dataLoader, socketId: mutatorId}) {
    const r = getRethink();
    const operationId = dataLoader.share();

    // teamMemberId is of format 'userId::teamId'
    const [, teamId] = teamMemberId.split('::');
    requireTeamMember(authToken, teamId);

    // RESOLUTION
    const teamMember = await r.table('TeamMember')
      .get(teamMemberId)
      .update({isCheckedIn}, {returnChanges: true})('changes')(0)('new_val');

    const teamMemberUpdated = {teamMember};
    getPubSub().publish(`${TEAM_MEMBER}.${teamId}`, {data: {teamMemberId, type: UPDATED}, mutatorId, operationId});
    return teamMemberUpdated;
  }
};
