# CBAAC Museum Module Documentation

## Overview

The CBAAC Museum module provides a digital showcase of over 2,500 artifacts from more than 30 African countries. Visitors can explore artifacts, listen to audio narrations, and request rentals or collaborations.

---

## Features

### For Visitors (Public)
- ✅ Browse artifact catalog
- ✅ Search artifacts by title, country, category, or tags
- ✅ Filter by country, category, or era
- ✅ View artifact details with multiple images
- ✅ Listen to audio narrations
- ✅ Request artifact rental
- ✅ Submit collaboration proposals

### For Admins
- ✅ Add/edit/delete artifacts
- ✅ Upload multiple images (3-10 per artifact)
- ✅ Upload audio narrations
- ✅ Generate unique identification numbers
- ✅ Toggle artifact visibility
- ✅ Mark featured artifacts
- ✅ Manage rental requests
- ✅ Manage collaboration requests
- ✅ Export request data

---

## Database Schema

### Tables

**1. Artifacts**
```sql
CREATE TABLE "Artifacts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "identificationNumber" VARCHAR(255) UNIQUE NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "country" VARCHAR(255) NOT NULL,
  "category" VARCHAR(255) NOT NULL,
  "era" VARCHAR(255),
  "yearOrPeriod" VARCHAR(255),
  "shortDescription" TEXT,
  "fullDescription" TEXT NOT NULL,
  "images" TEXT[],
  "audioNarration" VARCHAR(1000),
  "tags" VARCHAR(255)[],
  "isActive" BOOLEAN DEFAULT true,
  "isFeatured" BOOLEAN DEFAULT false,
  "createdBy" UUID,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. RentalRequests**
```sql
CREATE TABLE "RentalRequests" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "artifactId" UUID NOT NULL REFERENCES "Artifacts"("id") ON DELETE CASCADE,
  "userId" UUID,
  "fullName" VARCHAR(255) NOT NULL,
  "organization" VARCHAR(255),
  "email" VARCHAR(255) NOT NULL,
  "phoneNumber" VARCHAR(50) NOT NULL,
  "purposeOfRental" TEXT NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL,
  "message" TEXT,
  "status" VARCHAR(50) DEFAULT 'pending' CHECK ("status" IN ('pending', 'approved', 'rejected', 'completed')),
  "adminNotes" TEXT,
  "adminResponse" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**3. CollaborationRequests**
```sql
CREATE TABLE "CollaborationRequests" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "organization" VARCHAR(255),
  "email" VARCHAR(255) NOT NULL,
  "message" TEXT NOT NULL,
  "status" VARCHAR(50) DEFAULT 'pending' CHECK ("status" IN ('pending', 'responded', 'in-progress', 'completed')),
  "adminResponse" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
```sql
CREATE INDEX idx_artifacts_country ON "Artifacts"("country");
CREATE INDEX idx_artifacts_category ON "Artifacts"("category");
CREATE INDEX idx_artifacts_featured ON "Artifacts"("isFeatured");
CREATE INDEX idx_artifacts_identification ON "Artifacts"("identificationNumber");
CREATE INDEX idx_rentalrequests_artifact ON "RentalRequests"("artifactId");
CREATE INDEX idx_rentalrequests_status ON "RentalRequests"("status");
```

---

## API Endpoints

### Public Routes

#### Artifacts
```
GET    /v1/api/museum/artifacts              - Get all artifacts
GET    /v1/api/museum/artifacts/featured     - Get featured artifacts
GET    /v1/api/museum/artifacts/:id          - Get artifact details
GET    /v1/api/museum/filter-options         - Get filter options (countries, categories)
```

**Query Parameters for `/artifacts`:**
- `search` - Search by title, country, category, or tags
- `country` - Filter by country
- `category` - Filter by category
- `era` - Filter by era/period
- `featured` - Show only featured artifacts (true/false)

#### Requests
```
POST   /v1/api/museum/rental-requests        - Submit rental request
POST   /v1/api/museum/collaboration-requests - Submit collaboration request
```

### User Routes (Authenticated)

```
GET    /v1/api/museum/rental-requests/user/:userId - Get user's rental requests
```

### Admin Routes

#### Artifacts Management
```
POST   /v1/api/museum/admin/artifacts        - Create artifact
PUT    /v1/api/museum/admin/artifacts/:id    - Update artifact
DELETE /v1/api/museum/admin/artifacts/:id    - Delete artifact
```

#### Rental Requests Management
```
GET    /v1/api/museum/admin/rental-requests  - Get all rental requests
PATCH  /v1/api/museum/admin/rental-requests/:id - Update request status
```

#### Collaboration Requests Management
```
GET    /v1/api/museum/admin/collaboration-requests - Get all collaboration requests
PATCH  /v1/api/museum/admin/collaboration-requests/:id - Update request status
```

---

## Usage Examples

### 1. Add an Artifact (Admin)

```javascript
POST /v1/api/museum/admin/artifacts
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "identificationNumber": "CBAAC-AF-2025-001",
  "title": "Benin Bronze Head",
  "country": "Nigeria",
  "category": "Sculpture",
  "era": "16th Century",
  "yearOrPeriod": "1500-1600",
  "shortDescription": "A bronze head from the Benin Kingdom",
  "fullDescription": "This bronze head is a masterpiece from the Benin Kingdom...",
  "tags": ["bronze", "benin", "sculpture", "royal"],
  "isFeatured": true,
  "images": [<file1>, <file2>, <file3>],
  "audioNarration": <audio_file>
}
```

### 2. Browse Artifacts (Public)

```javascript
GET /v1/api/museum/artifacts?country=Nigeria&category=Sculpture

// Response:
{
  "message": "Artifacts retrieved successfully",
  "data": [
    {
      "id": "artifact-uuid",
      "identificationNumber": "CBAAC-AF-2025-001",
      "title": "Benin Bronze Head",
      "country": "Nigeria",
      "category": "Sculpture",
      "era": "16th Century",
      "shortDescription": "A bronze head from the Benin Kingdom",
      "images": ["https://...", "https://..."],
      "audioNarration": "https://...",
      "isFeatured": true
    }
  ]
}
```

### 3. View Artifact Details (Public)

```javascript
GET /v1/api/museum/artifacts/artifact-uuid

// Response:
{
  "message": "Artifact retrieved successfully",
  "data": {
    "id": "artifact-uuid",
    "identificationNumber": "CBAAC-AF-2025-001",
    "title": "Benin Bronze Head",
    "country": "Nigeria",
    "category": "Sculpture",
    "era": "16th Century",
    "yearOrPeriod": "1500-1600",
    "shortDescription": "A bronze head from the Benin Kingdom",
    "fullDescription": "This bronze head is a masterpiece...",
    "images": ["https://...", "https://...", "https://..."],
    "audioNarration": "https://cloudinary.com/audio/...",
    "tags": ["bronze", "benin", "sculpture", "royal"],
    "isFeatured": true
  }
}
```

### 4. Request Artifact Rental (Public)

```javascript
POST /v1/api/museum/rental-requests
Content-Type: application/json

{
  "artifactId": "artifact-uuid",
  "fullName": "Dr. Jane Smith",
  "organization": "National Museum",
  "email": "jane@museum.org",
  "phoneNumber": "+234800000000",
  "purposeOfRental": "Exhibition on African Art",
  "startDate": "2025-01-15",
  "endDate": "2025-03-15",
  "message": "We would like to feature this artifact in our exhibition"
}

// Response:
{
  "message": "Rental request submitted successfully. Confirmation email sent.",
  "request": {
    "id": "request-uuid",
    "artifactId": "artifact-uuid",
    "fullName": "Dr. Jane Smith",
    "status": "pending"
  }
}
```

### 5. Submit Collaboration Request (Public)

```javascript
POST /v1/api/museum/collaboration-requests
Content-Type: application/json

{
  "name": "John Doe",
  "organization": "Documentary Films Ltd",
  "email": "john@films.com",
  "message": "We are producing a documentary on African heritage and would like to collaborate with CBAAC Museum"
}
```

### 6. Get Filter Options (Public)

```javascript
GET /v1/api/museum/filter-options

// Response:
{
  "message": "Filter options retrieved successfully",
  "data": {
    "countries": ["Nigeria", "Ghana", "Kenya", "Egypt", ...],
    "categories": ["Sculpture", "Textiles", "Pottery", "Jewelry", ...]
  }
}
```

---

## User Flow

### Visitor Journey

1. **Museum Overview Page**
   - Grid/list of artifact cards
   - Each card shows: thumbnail, title, country, short description
   - Search bar and filters (country, category, era)

2. **Browse & Filter**
   - Search by keyword
   - Filter by country, category, or time period
   - View featured artifacts

3. **Artifact Details Page**
   - Full artifact information
   - Image gallery/carousel (3-10 images)
   - Audio narration player
   - Historical background
   - Unique identification number

4. **Audio Experience**
   - Play/pause/replay audio narration
   - Listen while viewing images
   - Learn about artifact's history and significance

5. **Request to Rent**
   - Click "Request to Rent" button
   - Fill rental request form
   - Submit request
   - Receive confirmation email

6. **Collaborate**
   - Click "Collaborate with Us" button
   - Fill collaboration form
   - Submit proposal
   - Admin receives notification

---

## Admin Dashboard Features

### Artifact Management
- Add new artifacts with metadata
- Generate unique identification numbers (e.g., CBAAC-AF-2025-001)
- Upload 3-10 images per artifact
- Upload audio narration (.mp3, .wav)
- Add tags for search indexing
- Toggle visibility (active/inactive)
- Mark as featured
- Preview before publishing
- Edit or delete artifacts

### Rental Request Management
- View all rental requests
- Filter by status (pending, approved, rejected, completed)
- View requester details and artifact info
- Update request status
- Add admin notes
- Send responses
- Export request data

### Collaboration Request Management
- View all collaboration proposals
- Update status (pending, responded, in-progress, completed)
- Add admin responses
- Reply via email
- Export collaboration data

---

## Audio Narration Feature

### Supported Formats
- MP3
- WAV
- M4A

### Implementation
```jsx
// Example React component
function ArtifactAudioPlayer({ audioUrl }) {
  return (
    <audio controls>
      <source src={audioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}
```

### Storage
- Audio files stored in Cloudinary
- Uploaded as `resource_type: "video"` (Cloudinary's audio handling)
- Organized in `Museum/Artifacts/Audio` folder

---

## Identification Number Format

**Format:** `CBAAC-[REGION]-[YEAR]-[NUMBER]`

**Examples:**
- `CBAAC-AF-2025-001` - African artifact, 2025, #001
- `CBAAC-WA-2025-045` - West African artifact, 2025, #045
- `CBAAC-EA-2024-123` - East African artifact, 2024, #123

**Regions:**
- AF - Africa (General)
- WA - West Africa
- EA - East Africa
- SA - Southern Africa
- NA - North Africa
- CA - Central Africa

---

## Environment Variables

Add to `.env`:

```env
# Museum Admin Email
MUSEUM_ADMIN_EMAIL=museum@cbaac.org

# Already configured
SENDGRID_API_KEY=your_sendgrid_key
SENDER_EMAIL=noreply@cbaac.org
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Frontend Integration

### Artifact Card Component

```jsx
function ArtifactCard({ artifact }) {
  return (
    <div className="artifact-card">
      <img src={artifact.images[0]} alt={artifact.title} />
      <h3>{artifact.title}</h3>
      <p>{artifact.country}</p>
      <p>{artifact.shortDescription}</p>
      <button onClick={() => navigate(`/artifacts/${artifact.id}`)}>
        View Details
      </button>
    </div>
  );
}
```

### Artifact Details with Audio

```jsx
function ArtifactDetails({ artifactId }) {
  const [artifact, setArtifact] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetch(`/v1/api/museum/artifacts/${artifactId}`)
      .then(res => res.json())
      .then(data => setArtifact(data.data));
  }, [artifactId]);

  if (!artifact) return <div>Loading...</div>;

  return (
    <div>
      {/* Image Gallery */}
      <div className="image-gallery">
        <img src={artifact.images[currentImage]} alt={artifact.title} />
        <div className="thumbnails">
          {artifact.images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              onClick={() => setCurrentImage(idx)}
              className={idx === currentImage ? 'active' : ''}
            />
          ))}
        </div>
      </div>

      {/* Artifact Info */}
      <h1>{artifact.title}</h1>
      <p><strong>ID:</strong> {artifact.identificationNumber}</p>
      <p><strong>Country:</strong> {artifact.country}</p>
      <p><strong>Category:</strong> {artifact.category}</p>
      <p><strong>Era:</strong> {artifact.era}</p>
      <p>{artifact.fullDescription}</p>

      {/* Audio Narration */}
      {artifact.audioNarration && (
        <div className="audio-player">
          <h3>Listen to the Story</h3>
          <audio controls>
            <source src={artifact.audioNarration} type="audio/mpeg" />
          </audio>
        </div>
      )}

      {/* Action Buttons */}
      <button onClick={() => navigate(`/rental-request/${artifact.id}`)}>
        Request to Rent
      </button>
      <button onClick={() => navigate('/collaborate')}>
        Collaborate with Us
      </button>
    </div>
  );
}
```

---

## Future Enhancements

- Virtual 3D artifact viewing
- AR (Augmented Reality) preview
- Multi-language audio narrations
- Video documentaries for artifacts
- Interactive timeline of African history
- Educational resources and lesson plans
- Virtual museum tours
- Social sharing features
- Artifact comparison tool

---

## Notes

- Minimum 3 images, maximum 10 images per artifact
- Audio narration is optional but recommended
- Unique identification numbers must be unique across all artifacts
- Rental requests require admin approval
- All admin routes require Admin or SuperAdmin role
- Automatic email notifications for all requests
- Featured artifacts appear on homepage

---

## Support

For issues or questions, contact the development team.
