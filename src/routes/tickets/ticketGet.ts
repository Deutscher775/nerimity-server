import { Request, Response, Router } from 'express';
import { rateLimit } from '../../middleware/rateLimit';

import { authenticate } from '../../middleware/authenticate';
import { getTicketById } from '../../services/Ticket';
import { generateError } from '../../common/errorHandler';

export function ticketGet(Router: Router) {
  Router.get(
    '/tickets/:id',
    authenticate(),
    rateLimit({
      name: 'ticket-get',
      restrictMS: 60000,
      requests: 30,
    }),
    route
  );
}

async function route(req: Request, res: Response) {
  const ticketId = req.params.id as string;
  const userId = req.userCache.id;
  const ticket = await getTicketById(ticketId, userId);

  if (!ticket) {
    return res.status(404).json(generateError('Ticket not found.'));
  }

  res.json(ticket);
}
