import { Router } from 'express';
import { channelMessageCreate } from './channelMessageCreate';
import { channelMessageDelete } from './channelMessageDelete';
import { channelMessages } from './channelMessages';
import { channelMessageUpdate } from './channelMessageUpdate';
import { channelTypingIndicator } from './channelTypingIndicator';
import { channelAttachments } from './channelAttachments';
import { channelMessageReactionsAdd } from './channelMessageReactionsAdd';
import { channelMessageReactionsRemove } from './channelMessageReactionsRemove';
import { channelMessageReactedUsers } from './channelMessageReactions';
import { channelDMClose } from './channelDmClose';

const ChannelsRouter = Router();

channelMessages(ChannelsRouter);
channelAttachments(ChannelsRouter);
channelMessageCreate(ChannelsRouter);
channelMessageUpdate(ChannelsRouter);
channelMessageDelete(ChannelsRouter);
channelTypingIndicator(ChannelsRouter);

channelMessageReactedUsers(ChannelsRouter);
channelMessageReactionsAdd(ChannelsRouter);
channelMessageReactionsRemove(ChannelsRouter);

channelDMClose(ChannelsRouter);

export { ChannelsRouter };
