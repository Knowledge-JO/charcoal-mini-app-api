import { Request, Response } from "express"

async function upgradeMultiTap(req: Request, res: Response) {}
async function upgradeEnergyLimits(req: Request, res: Response) {}

async function upgradeRecharge(req: Request, res: Response) {}

async function upgradeCharcoalTurbo(req: Request, res: Response) {}
async function upgradeEmberBurst(req: Request, res: Response) {}

export {
	upgradeMultiTap,
	upgradeEnergyLimits,
	upgradeRecharge,
	upgradeCharcoalTurbo,
	upgradeEmberBurst,
}
