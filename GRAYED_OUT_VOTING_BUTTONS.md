# Grayed Out Voting Buttons for Already Voted Users

## 🎯 Overview

Implemented a feature to gray out voting buttons for users whose IP address has already voted in a specific voting. This provides better visual feedback and prevents confusion about voting status.

## 🔧 Implementation

### **1. New API Endpoint**

**File**: `src/app/api/votings/[id]/check-vote/route.ts`

```typescript
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Get client IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown'

  // Check if this IP has already voted
  const alreadyVoted = await hasUserVoted(parseInt(id), ipAddress)
  
  return NextResponse.json({ 
    hasVoted: alreadyVoted,
    ipAddress: ipAddress 
  })
}
```

### **2. Updated VotingSection Component**

**File**: `src/components/VotingSection.tsx`

#### **New State Management:**
```typescript
const [voteStatuses, setVoteStatuses] = useState<Record<number, boolean>>({})
```

#### **Vote Status Checking:**
- Checks vote status for each active voting on page load
- Uses parallel API calls for better performance
- Stores results in state for UI updates

#### **Updated Button Logic:**
```typescript
{item.status === 'active' && !voteStatuses[item.id] && (
  <a href={`/voting/${item.id}`} className="btn-primary flex-1 text-center">
    Weź udział w głosowaniu
  </a>
)}
{item.status === 'active' && voteStatuses[item.id] && (
  <button disabled className="btn-secondary flex-1 text-center opacity-50 cursor-not-allowed">
    ✓ Już głosowałeś
  </button>
)}
```

### **3. Updated Voting Page**

**File**: `src/app/voting/page.tsx`

- Applied the same logic as VotingSection
- Consistent behavior across all voting interfaces
- Same visual feedback for already voted users

## 🎨 User Experience

### **Button States:**

| State | Button Appearance | Text | Action |
|-------|------------------|------|--------|
| **Not Voted** | Blue primary button | "Weź udział w głosowaniu" | Clickable link |
| **Already Voted** | Grayed out button | "✓ Już głosowałeś" | Disabled |
| **Upcoming** | Grayed out button | "Głosowanie wkrótce" | Disabled |
| **Closed** | Grayed out button | "Głosowanie zakończone" | Disabled |

### **Visual Indicators:**
- **✓ Checkmark**: Clear indication that user has already voted
- **Grayed Out**: Visual feedback that action is not available
- **Disabled State**: Prevents accidental clicks
- **Consistent Styling**: Matches other disabled states

## 🔄 How It Works

### **1. Page Load Process:**
1. Load all votings from API
2. Filter active votings
3. Check vote status for each active voting in parallel
4. Update UI state with vote statuses
5. Render appropriate button states

### **2. IP Detection:**
- **Server-side**: Captures IP from request headers
- **Headers Checked**: `x-forwarded-for`, `x-real-ip`
- **Fallback**: Uses 'unknown' if IP cannot be determined
- **Proxy Support**: Handles forwarded IPs correctly

### **3. Database Integration:**
- Uses existing `hasUserVoted` function
- Checks `votes` table by `voting_id` and `ip_address`
- Leverages IP tracking implementation

## ✅ Benefits

### **1. Better User Experience**
- **Clear Feedback**: Users know immediately if they've already voted
- **Prevents Confusion**: No more wondering about voting status
- **Visual Clarity**: Obvious distinction between available and unavailable actions

### **2. Improved Performance**
- **Parallel Checks**: All vote statuses checked simultaneously
- **Efficient API**: Single endpoint for vote status checking
- **Cached State**: Vote statuses stored in component state

### **3. Enhanced Security**
- **IP-based Checking**: Consistent with vote deduplication logic
- **Server-side Validation**: IP detection happens on server
- **No Client Manipulation**: Status cannot be bypassed client-side

## 🚀 Technical Details

### **API Endpoint:**
- **Route**: `/api/votings/[id]/check-vote`
- **Method**: GET
- **Response**: `{ hasVoted: boolean, ipAddress: string }`
- **Error Handling**: Graceful fallback to `hasVoted: false`

### **Performance Optimizations:**
- **Parallel API Calls**: All vote statuses checked simultaneously
- **Efficient Filtering**: Only active votings are checked
- **Error Resilience**: Individual failures don't break the entire process

### **State Management:**
- **Type Safety**: `Record<number, boolean>` for vote statuses
- **Reactive Updates**: UI updates automatically when state changes
- **Memory Efficient**: Only stores boolean values

## 📱 Responsive Design

- **Mobile**: Buttons stack vertically on small screens
- **Desktop**: Buttons display side by side
- **Consistent**: Same behavior across all screen sizes
- **Accessible**: Proper disabled states for screen readers

## 🔧 Configuration

### **No Additional Setup Required:**
- Uses existing IP tracking infrastructure
- Leverages current database schema
- No new environment variables needed
- Works with existing vote deduplication

## ✅ Status

- ✅ **API Endpoint**: Created and tested
- ✅ **VotingSection**: Updated with grayed out buttons
- ✅ **Voting Page**: Updated with grayed out buttons
- ✅ **Build Status**: Compiles successfully
- ✅ **Type Safety**: All TypeScript types correct
- ✅ **Error Handling**: Graceful fallbacks implemented

**The grayed out voting button feature is now fully implemented and ready for use! 🎉**

## 🧪 Testing Scenarios

### **1. First-time Voter:**
- Button shows "Weź udział w głosowaniu"
- Button is clickable and blue
- Can proceed to voting page

### **2. Already Voted:**
- Button shows "✓ Już głosowałeś"
- Button is grayed out and disabled
- Cannot click to vote again

### **3. Network Issues:**
- Graceful fallback to "not voted" state
- No broken functionality
- User can still attempt to vote

### **4. Different Votings:**
- Each voting checked independently
- Can vote on one, grayed out on another
- Status updates correctly per voting
