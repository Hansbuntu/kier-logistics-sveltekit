<script>
  export let trackingData;

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'handover':
        return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
      case 'in-transit':
        return 'M13 10V3L4 14h7v7l9-11h-7z';
      case 'secured':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'delivered':
        return 'M5 13l4 4L19 7';
      default:
        return 'M13 10V3L4 14h7v7l9-11h-7z';
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'handover':
        return 'bg-blue-100 text-blue-800';
      case 'in-transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'secured':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<div class="space-y-4">
  {#each trackingData.custodyChain as entry, index}
    <div class="flex items-start space-x-4">
      <!-- Timeline connector -->
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getStatusIcon(entry.status)}></path>
          </svg>
        </div>
        {#if index < trackingData.custodyChain.length - 1}
          <div class="w-0.5 h-8 bg-gray-300 mt-2"></div>
        {/if}
      </div>

      <!-- Content -->
      <div class="flex-1 bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-medium text-gray-900">
            {entry.status.replace('-', ' ').toUpperCase()}
          </h4>
          <span class="text-sm text-gray-500">
            {formatTimestamp(entry.timestamp)}
          </span>
        </div>

        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span class="text-sm text-gray-700">
              Guardian: <span class="font-medium">{entry.guardianName}</span>
            </span>
          </div>

          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-sm text-gray-700">
              Location: <span class="font-medium">{entry.location.address}</span>
            </span>
          </div>

          {#if entry.location.facility}
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span class="text-sm text-gray-700">
                Facility: <span class="font-medium">{entry.location.facility}</span>
              </span>
            </div>
          {/if}

          {#if entry.notes}
            <div class="flex items-start space-x-2">
              <svg class="w-4 h-4 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span class="text-sm text-gray-700">
                {entry.notes}
              </span>
            </div>
          {/if}

          <div class="flex items-center space-x-2">
            {#if entry.verified}
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm text-green-600 font-medium">Verified</span>
            {:else}
              <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm text-yellow-600">Pending Verification</span>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div> 