# Portal de Seguimiento de Incidencias 🎫

Sistema fullstack serverless para gestión de tickets/incidencias, construido con **Next.js** (Frontend) y **AWS SAM** (Backend: Lambda, DynamoDB, API Gateway).

## 📋 Características

- ✅ **Crear tickets** con título, descripción, prioridad y asignación
- ✅ **Consultar tickets** con filtros por estado (Abierto, En Progreso, Resuelto, Cerrado)
- ✅ **Actualizar estado** de tickets
- ✅ **Eliminar tickets**
- ✅ **Interfaz responsive** con tema oscuro profesional
- ✅ **API Key** para seguridad básica
- ✅ **Índice secundario** en DynamoDB para consultas por estado

## 🏗️ Arquitectura

![Arquitectura de la app](/frontend/public/Arquitectura.png)


## 📁 Estructura del Proyecto

```
incident-portal-fullstack/
│
├── frontend/                          # Aplicación Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Página principal (Dashboard)
│   │   │   ├── layout.tsx            # Layout raíz
│   │   │   └── globals.css           # Estilos globales (Tailwind)
│   │   │
│   │   ├── components/
│   │   │   ├── dashboard-header.tsx  # Header con acciones
│   │   │   ├── ticket-stats.tsx      # Estadísticas por estado
│   │   │   ├── ticket-filters.tsx    # Filtros por estado
│   │   │   ├── ticket-table.tsx      # Tabla de tickets
│   │   │   └── ui/                   # Componentes reutilizables
│   │   │       ├── button.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── table.tsx
│   │   │       └── dropdown-menu.tsx
│   │   │
│   │   └── lib/
│   │       ├── api.ts                # Cliente API con fallback a mock
│   │       ├── types.ts              # Tipos TypeScript compartidos
│   │       └── utils.ts              # Utilidades
│   │
│   ├── public/                        # Archivos estáticos
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── README.md
│
├── backend/                           # Backend Serverless (AWS SAM)
│   ├── template.yaml                  # SAM Template (Lambda, API Gateway, DynamoDB)
│   ├── samconfig.toml
│   │
│   └── src/
│       ├── handlers/
│       │   ├── get-tickets.js
│       │   ├── get-ticket-by-id.js
│       │   ├── create-ticket.js
│       │   ├── update-tickets.js
│       │   └── delete-ticket.js
│       │
│       └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Ejecución Local

### Frontend (Next.js)

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir http://localhost:3000
```

> El frontend incluye datos mock para funcionar sin backend.

### Backend (AWS SAM)

#### Prerrequisitos
- [AWS CLI](https://aws.amazon.com/cli/) configurado
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- [Docker](https://www.docker.com/) (para ejecución local)

```bash
# Navegar al backend
cd backend

# Instalar dependencias de Lambda
cd src && npm install && cd ..

# Ejecutar localmente con SAM
sam local start-api --port 3001

# El API estará disponible en http://localhost:3001
```

#### Probar con DynamoDB Local (opcional)

```bash
# Ejecutar DynamoDB local con Docker
docker run -p 8000:8000 amazon/dynamodb-local

# Crear tabla local
aws dynamodb create-table \
  --table-name tickets-dev \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=status,AttributeType=S AttributeName=createdAt,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes '[{"IndexName":"StatusIndex","KeySchema":[{"AttributeName":"status","KeyType":"HASH"},{"AttributeName":"createdAt","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}}]' \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000
```

## ☁️ Despliegue en AWS

### 1. Desplegar Backend

```bash
cd backend

# Build
sam build

# Deploy (primera vez - guiado)
sam deploy --guided

# Deploy (siguientes veces)
sam deploy
```

El comando `sam deploy --guided` te preguntará:
- **Stack Name**: `tickets-api-dev`
- **AWS Region**: tu región preferida
- **Parameter Stage**: `dev` (o `staging`/`prod`)
- **Confirm changes before deploy**: `Y`
- **Allow SAM CLI IAM role creation**: `Y`

### 2. Obtener API Key

Después del deploy, obtén el API Key desde la consola de AWS:
1. Ve a **API Gateway** → **APIs** → **tickets-api-dev**
2. En el menú lateral, ve a **API Keys**
3. Copia el valor del API Key generado

### 3. Configurar Frontend

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
NEXT_PUBLIC_API_KEY=tu-api-key-aqui
```

### 4. Desplegar Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel Dashboard
```

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tickets` | Obtener todos los tickets |
| GET | `/tickets?status=OPEN` | Filtrar por estado |
| GET | `/tickets/{id}` | Obtener ticket por ID |
| POST | `/tickets` | Crear nuevo ticket |
| PATCH | `/tickets/{id}` | Actualizar ticket |
| DELETE | `/tickets/{id}` | Eliminar ticket |

### Ejemplo: Crear Ticket

```bash
curl -X POST https://api-url/dev/tickets \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Error en producción",
    "description": "La API no responde",
    "priority": "CRITICAL",
    "createdBy": "usuario@empresa.com"
  }'
```

## 🔐 Seguridad

- **API Key**: Requerido en header `x-api-key` para todas las peticiones
- **CORS**: Configurado para permitir orígenes específicos
- **IAM**: Políticas mínimas necesarias para cada Lambda

## 📊 Modelo de Datos

### Ticket

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String (UUID) | Identificador único |
| title | String | Título del ticket |
| description | String | Descripción detallada |
| status | Enum | OPEN, IN_PROGRESS, RESOLVED, CLOSED |
| priority | Enum | LOW, MEDIUM, HIGH, CRITICAL |
| createdAt | ISO DateTime | Fecha de creación |
| updatedAt | ISO DateTime | Última actualización |
| createdBy | String (email) | Creador del ticket |
| assignedTo | String (email) | Persona asignada (opcional) |

## 🛠️ Tecnologías Utilizadas

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- date-fns

### Backend
- AWS Lambda (Node.js 18)
- Amazon DynamoDB
- Amazon API Gateway
- AWS SAM

## 📝 Mejoras Futuras

- [ ] Autenticación con Cognito
- [ ] Comentarios en tickets
- [ ] Notificaciones por email (SES)
- [ ] Dashboard con métricas (CloudWatch)
- [ ] Búsqueda full-text
- [ ] Adjuntos de archivos (S3)

## 👨‍💻 Autor

Desarrollado como prueba técnica para posición Fullstack Developer.

---

**Licencia**: MIT
