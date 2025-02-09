import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql'
import TaskServiceEnum from './TaskServiceEnum'
import TaskStatusEnum from './TaskStatusEnum'

const CreateTaskIntegrationInput = new GraphQLInputObjectType({
  name: 'CreateTaskIntegrationInput',
  fields: () => ({
    service: {
      type: GraphQLNonNull(TaskServiceEnum),
      description: 'The service to push this new task to'
    },
    serviceProjectHash: {
      type: GraphQLNonNull(GraphQLString),
      description:
        'The key or composite key where the task should live in the service, e.g. nameWithOwner or cloudId:projectKey'
    }
  })
})

const CreateTaskInput = new GraphQLInputObjectType({
  name: 'CreateTaskInput',
  fields: () => ({
    content: {
      type: GraphQLString
    },
    plaintextContent: {
      type: GraphQLString
    },
    meetingId: {
      type: GraphQLID,
      description: 'foreign key for the meeting this was created in'
    },
    discussionId: {
      type: GraphQLID,
      description: 'foreign key for the thread this was created in'
    },
    threadSortOrder: {
      type: GraphQLFloat
    },
    threadParentId: {
      type: GraphQLID
    },
    sortOrder: {
      type: GraphQLFloat
    },
    status: {
      type: new GraphQLNonNull(TaskStatusEnum)
    },
    teamId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'teamId, the team the task is on'
    },
    userId: {
      type: GraphQLID,
      description:
        'userId, the owner of the task. This can be null if the task is not assigned to anyone.'
    },
    integration: {
      type: CreateTaskIntegrationInput
    }
  })
})

export default CreateTaskInput
