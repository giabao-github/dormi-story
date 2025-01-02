import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { getReceivedFriendRequests } from '@/app/actions/getReceivedFriendRequests';
import { getParkingRequests } from '@/app/actions/getParkingRequests';
import { Friend } from '@prisma/client';
import { getSentFriendRequests } from '@/app/actions/getSentFriendRequests';
import { getApprovedParkingRequests } from '@/app/actions/getApprovedParkingRequests';

export async function POST() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const receivedRequests = await getReceivedFriendRequests(currentUser?.id);
    const pendingRequests = receivedRequests.filter((request) => request.status === 'Pending');
    const sentRequests = await getSentFriendRequests(currentUser?.id);
    const parkingRequests = await getParkingRequests();
    const notification = receivedRequests.length > 0 ? pendingRequests.length : 0;
    const parkingCount = parkingRequests.length;
    const approvedRequests = await getApprovedParkingRequests();

    return NextResponse.json({
      pendingRequests,
      sentRequests,
      receivedRequests,
      parkingRequests,
      approvedRequests,
      notification,
      parkingCount
    });
  } catch (error: any) {
    console.log('Error at /api/refresh:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}