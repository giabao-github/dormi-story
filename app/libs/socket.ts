import { ParkingSpot } from '@prisma/client';
import { Server } from 'socket.io';

let io: Server | null = null;
const lockTimers: Map<string, NodeJS.Timeout> = new Map();

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-building', (buildingId: string) => {
      socket.join(buildingId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

export async function handleSpotLock(
  buildingId: string,
  spotId: string,
  userId: string,
  prisma: any
) {
  // Clear existing timer for this spot, if any
  if (lockTimers.has(spotId)) {
    clearTimeout(lockTimers.get(spotId)!);
    lockTimers.delete(spotId);
  }

  // Set a new timer for 20 seconds to release the lock
  const timer = setTimeout(async () => {
    try {
      await prisma.parkingSpot.update({
        where: { id: spotId, userId: userId },
        data: { status: 'available' },
      });

      // Notify clients that the spot has been updated
      const updatedSpots = await prisma.parkingSpot.findMany({
        where: { buildingId },
      });
      if (io) {
        io.to(buildingId).emit('spots-updated', updatedSpots);
      } 

      // Clean up the timer map
      lockTimers.delete(spotId);
    } catch (error) {
      console.error('Error releasing lock for spot:', error);
    }
  }, 5000);

  lockTimers.set(spotId, timer);
}

export function notifySpotUpdate(buildingId: string, updatedSpots: ParkingSpot[]) {
  if (io) {
    io.to(buildingId).emit('spots-updated', updatedSpots);
  }
}
