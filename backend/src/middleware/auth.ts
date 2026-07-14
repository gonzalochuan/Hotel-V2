import type { NextFunction, Request, Response } from 'express'
import { supabase } from '../lib/supabaseClient.js'
import { HttpError } from './errorHandler.js'

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null

  if (!token) {
    next(new HttpError(401, 'Missing bearer token'))
    return
  }

  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data.user) {
      next(new HttpError(401, 'Invalid or expired session'))
      return
    }

    req.user = data.user
    req.accessToken = token
    next()
  } catch (err) {
    next(err)
  }
}
