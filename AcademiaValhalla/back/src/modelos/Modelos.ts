import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany, BelongsToMany, Unique, AllowNull } from 'sequelize-typescript';
import { Dificultad, Categoria, EstadoProgreso, TipoContenido, TipoPublicacion, BloqueContenidoNota, RolUsuario } from '../types/types.js';

// ==========================================
// Tablas intermedias y tags
// ==========================================

@Table({ tableName: 'tags', timestamps: false })
export class Etiqueta extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    tag_id!: string;

    @Unique
    @Column(DataType.STRING(50))
    name!: string;

    @BelongsToMany(() => Publicacion, () => EtiquetaPublicacion)
    publicaciones!: Publicacion[];

    @BelongsToMany(() => Reto, () => EtiquetaReto)
    retos!: Reto[];
}

@Table({ tableName: 'challenge_tags', timestamps: false })
export class EtiquetaReto extends Model {
    @ForeignKey(() => Reto)
    @Column(DataType.UUID)
    challenge_id!: string;

    @ForeignKey(() => Etiqueta)
    @Column(DataType.UUID)
    tag_id!: string;
}

@Table({ tableName: 'post_tags', timestamps: false })
export class EtiquetaPublicacion extends Model {
    @ForeignKey(() => Publicacion)
    @Column(DataType.UUID)
    post_id!: string;

    @ForeignKey(() => Etiqueta)
    @Column(DataType.UUID)
    tag_id!: string;
}

// ==========================================
// Usuario y autenticación
// ==========================================

@Table({ tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class Usuario extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    user_id!: string;

    @Unique
    @Column(DataType.STRING(50))
    username!: string;

    @Unique
    @Column(DataType.STRING(255))
    email!: string;

    @Column(DataType.STRING(255))
    password!: string;

    @Column(DataType.STRING(500))
    avatar_url?: string;

    @Column(DataType.TEXT)
    bio?: string;

    @Default(0)
    @Column(DataType.INTEGER)
    experience_points!: number;

    @Default(1)
    @Column(DataType.INTEGER)
    current_level!: number;

    @Column(DataType.STRING(255))
    github_url?: string;

    @Column(DataType.STRING(255))
    linkedin_url?: string;

    @Unique
    @Column(DataType.STRING(255))
    google_id?: string;

    @Unique
    @Column(DataType.STRING(255))
    github_id?: string;

    @Default(0)
    @Column(DataType.INTEGER)
    streak_days!: number;

    @Default(false)
    @Column(DataType.BOOLEAN)
    is_banned!: boolean;

    @Default(RolUsuario.USUARIO)
    @Column(DataType.ENUM(...Object.values(RolUsuario)))
    role!: RolUsuario;

    @Default(0)
    @Column(DataType.INTEGER)
    total_comments!: number;

    @Default(0)
    @Column(DataType.INTEGER)
    total_solutions!: number;

    @HasMany(() => TokenRefresh)
    tokenesRefresh!: TokenRefresh[];

    @HasMany(() => ProgresoRetoUsuario)
    progresoRetos!: ProgresoRetoUsuario[];

    @HasMany(() => Publicacion)
    publicaciones!: Publicacion[];

    @HasMany(() => LogroUsuario)
    logrosUsuario!: LogroUsuario[];
}

@Table({ tableName: 'refresh_tokens', timestamps: false })
export class TokenRefresh extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    token_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Column(DataType.STRING(255))
    token_hash!: string;

    @Column(DataType.DATE)
    expires_at!: Date;

    @BelongsTo(() => Usuario)
    usuario!: Usuario;
}

// ==========================================
// Retos
// ==========================================

@Table({ tableName: 'programming_languages', timestamps: false })
export class LenguajeProgramacion extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    language_id!: string;

    @Unique
    @Column(DataType.STRING(50))
    name!: string;

    @Column(DataType.STRING(50))
    monaco_language_id?: string;

    @BelongsToMany(() => Reto, () => LenguajeReto)
    retos!: Reto[];
}

@Table({ tableName: 'challenge_languages', timestamps: false })
export class LenguajeReto extends Model {
    @ForeignKey(() => Reto)
    @Column(DataType.UUID)
    challenge_id!: string;

    @ForeignKey(() => LenguajeProgramacion)
    @Column(DataType.UUID)
    language_id!: string;

    @Column(DataType.TEXT)
    initial_code?: string;

    @Column(DataType.TEXT)
    solution_code?: string;

    @Column(DataType.TEXT)
    validation_code?: string;
}

@Table({ tableName: 'challenges', timestamps: true, createdAt: 'created_at', updatedAt: false })
export class Reto extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    challenge_id!: string;

    @Column(DataType.STRING(255))
    title!: string;

    @Column(DataType.TEXT)
    description!: string;

    @Column(DataType.ENUM(...Object.values(Dificultad)))
    difficulty!: Dificultad;

    @Column(DataType.ENUM(...Object.values(Categoria)))
    category!: Categoria;

    @Column(DataType.INTEGER)
    experience_reward!: number;

    @Column(DataType.TEXT)
    instructions?: string;

    @Column(DataType.TEXT)
    example_output?: string;

    @Default([])
    @Column(DataType.JSONB)
    examples!: object[];

    @Default([])
    @Column(DataType.JSONB)
    hints!: object[];

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    created_by?: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    generated_by_ai?: boolean;

    @AllowNull(true)
    @Column(DataType.UUID)
    generated_for?: string | null;

    @Default([])
    @Column(DataType.JSONB)
    test_cases!: { stdin: string; expected_stdout: string; hidden?: boolean }[];

    @BelongsTo(() => Usuario)
    autor!: Usuario;

    @BelongsToMany(() => LenguajeProgramacion, () => LenguajeReto)
    lenguajes!: LenguajeProgramacion[];

    @BelongsToMany(() => Usuario, () => ProgresoRetoUsuario)
    participantes!: Usuario[];

    @BelongsToMany(() => Etiqueta, () => EtiquetaReto)
    etiquetas!: Etiqueta[];
}

@Table({ tableName: 'user_challenge_progress', timestamps: true, updatedAt: 'last_attempt_at' })
export class ProgresoRetoUsuario extends Model {
    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @ForeignKey(() => Reto)
    @Column(DataType.UUID)
    challenge_id!: string;

    @Default(EstadoProgreso.SIN_EMPEZAR)
    @Column(DataType.ENUM(...Object.values(EstadoProgreso)))
    status!: EstadoProgreso;

    @Column(DataType.TEXT)
    user_solution?: string;

    @Column(DataType.DATE)
    completed_at?: Date;

    @BelongsTo(() => Reto)
    reto!: Reto;
}

// ==========================================
// Comunidad
// ==========================================

@Table({ tableName: 'posts', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class Publicacion extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    post_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    author_id!: string;

    @Column(DataType.STRING(255))
    title!: string;

    @Column(DataType.STRING(255))
    slug?: string;

    @Column(DataType.JSONB)
    content!: object[];

    @Column(DataType.ENUM(...Object.values(TipoPublicacion)))
    post_type!: TipoPublicacion;

    @Default(0)
    @Column(DataType.INTEGER)
    view_count!: number;

    @Default(0)
    @Column(DataType.INTEGER)
    upvote_count!: number;

    @BelongsTo(() => Usuario)
    autor!: Usuario;

    @HasMany(() => ComentarioUsuario)
    comentarios!: ComentarioUsuario[];

    @BelongsToMany(() => Etiqueta, () => EtiquetaPublicacion)
    etiquetas!: Etiqueta[];

    @HasMany(() => Voto)
    votos!: Voto[];
}

@Table({ tableName: 'user_comments', timestamps: true })
export class ComentarioUsuario extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    user_comment_id!: string;

    @ForeignKey(() => Publicacion)
    @Column(DataType.UUID)
    post_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    author_id!: string;

    @ForeignKey(() => ComentarioUsuario)
    @Column(DataType.UUID)
    parent_user_comment_id?: string;

    @Column(DataType.TEXT)
    content!: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    is_solution!: boolean;

    @BelongsTo(() => Usuario)
    autor!: Usuario;

    @HasMany(() => ComentarioUsuario, 'parent_user_comment_id')
    respuestas!: ComentarioUsuario[];
}

@Table({ tableName: 'votes', timestamps: true, updatedAt: false })
export class Voto extends Model {
    @ForeignKey(() => Publicacion)
    @Column(DataType.UUID)
    post_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Column(DataType.INTEGER)
    value!: number;
}

@Table({ tableName: 'user_notes', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class NotaUsuario extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    note_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Column(DataType.STRING(255))
    title!: string;

    @Column(DataType.TEXT)
    description?: string;

    @Column(DataType.TEXT)
    summary!: string;

    @Column(DataType.STRING(50))
    language!: string;

    @Column(DataType.ARRAY(DataType.STRING))
    tags!: string[];

    @Column(DataType.STRING(50))
    difficulty!: string;

    @Column(DataType.JSONB)
    content!: BloqueContenidoNota[];

    @Default('personal')
    @Column(DataType.ENUM('personal', 'pending', 'approved', 'rejected'))
    community_status!: string;

    @BelongsTo(() => Usuario, 'user_id')
    autorNota!: Usuario;

    @HasMany(() => RevisionNota, 'note_id')
    revisiones!: RevisionNota[];
}

@Table({ tableName: 'academy_content', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class ContenidoAcademia extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    content_id!: string;

    @Column(DataType.STRING(255))
    title!: string;

    @Unique
    @Column(DataType.STRING(255))
    slug!: string;

    @Column(DataType.TEXT)
    description?: string;

    @Column(DataType.JSONB)
    body!: object[];

    @Default(TipoContenido.LECCION)
    @Column(DataType.ENUM(...Object.values(TipoContenido)))
    type!: TipoContenido;

    @Default(false)
    @Column(DataType.BOOLEAN)
    is_published!: boolean;

    @Default(0)
    @Column(DataType.INTEGER)
    order_index!: number;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    author_id!: string;

    @BelongsTo(() => Usuario)
    autor!: Usuario;
}

// ==========================================
// Mensajería
// ==========================================

@Table({ tableName: 'conversations', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class Conversacion extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    conversation_id!: string;

    @Column(DataType.TEXT)
    last_message?: string;

    @Column(DataType.DATE)
    last_message_time?: Date;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    last_message_sender_id?: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    is_group!: boolean;

    @AllowNull(true)
    @Column(DataType.STRING(100))
    name?: string;

    @AllowNull(true)
    @Column(DataType.STRING(500))
    avatar_url?: string;

    @AllowNull(true)
    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    created_by?: string;

    @HasMany(() => Mensaje)
    mensajes!: Mensaje[];

    @HasMany(() => ParticipanteConversacion)
    participantes!: ParticipanteConversacion[];
}

@Table({ tableName: 'conversation_participants', timestamps: false })
export class ParticipanteConversacion extends Model {
    @ForeignKey(() => Conversacion)
    @Column(DataType.UUID)
    conversation_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Default(0)
    @Column(DataType.INTEGER)
    unread_count!: number;

    @Default(false)
    @Column(DataType.BOOLEAN)
    is_archived!: boolean;

    @Default('member')
    @Column(DataType.ENUM('owner', 'admin', 'member'))
    role!: string;

    @BelongsTo(() => Conversacion)
    conversacion!: Conversacion;

    @BelongsTo(() => Usuario)
    usuario!: Usuario;
}

@Table({ tableName: 'messages', timestamps: true, createdAt: 'created_at', updatedAt: false })
export class Mensaje extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    message_id!: string;

    @ForeignKey(() => Conversacion)
    @Column(DataType.UUID)
    conversation_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    sender_id!: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    content?: string;

    @Default('text')
    @Column(DataType.STRING(10))
    message_type!: string;

    @AllowNull(true)
    @Column(DataType.STRING(500))
    attachment_url?: string;

    @AllowNull(true)
    @Column(DataType.JSONB)
    attachment_meta?: object;

    @Default(false)
    @Column(DataType.BOOLEAN)
    read!: boolean;

    @AllowNull(true)
    @Column(DataType.UUID)
    reply_to_id!: string | null;

    @BelongsTo(() => Conversacion)
    conversacion!: Conversacion;

    @BelongsTo(() => Usuario)
    emisor!: Usuario;
}

// ==========================================
// Solicitudes de contenido
// ==========================================

@Table({ tableName: 'content_requests', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class SolicitudContenido extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    request_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    author_id!: string;

    @BelongsTo(() => Usuario, 'author_id')
    autor!: Usuario;

    @Column(DataType.ENUM('challenge', 'note'))
    content_type!: string;

    @Default('pending')
    @Column(DataType.ENUM('pending', 'approved', 'rejected'))
    status!: string;

    @Column(DataType.STRING(255))
    title!: string;

    @Column(DataType.TEXT)
    description!: string;

    @Column(DataType.JSONB)
    metadata!: object;

    @Column(DataType.TEXT)
    rejection_reason?: string;

    @Column(DataType.UUID)
    reviewed_by?: string;

    @Column(DataType.DATE)
    reviewed_at?: Date;

    @Column(DataType.UUID)
    resource_id?: string;

    @Column(DataType.ENUM('challenge', 'note'))
    resource_type?: string;
}

// ==========================================
// Reportes de posts
// ==========================================

@Table({ tableName: 'post_reports', timestamps: true, createdAt: 'reported_at', updatedAt: false })
export class ReportePublicacion extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    report_id!: string;

    @ForeignKey(() => Publicacion)
    @Column(DataType.UUID)
    post_id!: string;

    @BelongsTo(() => Publicacion, 'post_id')
    publicacion!: Publicacion;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    reporter_id!: string;

    @BelongsTo(() => Usuario, 'reporter_id')
    reportador!: Usuario;

    @Column(DataType.TEXT)
    reason!: string;

    @Default('pending')
    @Column(DataType.ENUM('pending', 'dismissed', 'removed'))
    status!: string;
}

// ==========================================
// Logros (Achievements)
// ==========================================

@Table({ tableName: 'achievements', timestamps: true, underscored: true })
export class Logro extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    achievement_id!: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    title!: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    description!: string;

    @Column({
        type: DataType.ENUM(
            'challenge_count', 'note_count', 'comment_count',
            'solutions_given', 'level_reached', 'streak_days',
            'xp_total', 'custom',
            'post_count', 'post_featured', 'avatar_changed'
        ),
        allowNull: false,
    })
    trigger_type!: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
    threshold!: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    xp_reward!: number;

    @Column({
        type: DataType.ENUM('common', 'rare', 'epic', 'legendary'),
        allowNull: false,
        defaultValue: 'common',
    })
    rarity!: string;

    @Column({ type: DataType.STRING(500), allowNull: true })
    emblem_url!: string | null;

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_active!: boolean;

    @Default('pending')
    @Column(DataType.ENUM('pending', 'published'))
    status!: string;

    @Default(0)
    @Column(DataType.INTEGER)
    display_order!: number;

    @HasMany(() => LogroUsuario)
    logrosUsuario!: LogroUsuario[];
}

// ==========================================
// Recuperación de contraseña
// ==========================================

@Table({ tableName: 'password_reset_codes', timestamps: false })
export class CodigoRestablecimiento extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    reset_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Column(DataType.STRING(255))
    code_hash!: string;

    @Column(DataType.DATE)
    expires_at!: Date;

    @Default(false)
    @Column(DataType.BOOLEAN)
    used!: boolean;

    @Column(DataType.DATE)
    created_at!: Date;

    @BelongsTo(() => Usuario, 'user_id')
    usuario!: Usuario;
}

// ==========================================
// Revisiones de notas aprobadas en comunidad
// ==========================================

@Table({ tableName: 'note_revisions', timestamps: true, createdAt: 'created_at', updatedAt: false })
export class RevisionNota extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    revision_id!: string;

    @ForeignKey(() => NotaUsuario)
    @Column(DataType.UUID)
    note_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    author_id!: string;

    @Column(DataType.JSONB)
    payload!: object;

    @Default('pending')
    @Column(DataType.ENUM('pending', 'approved', 'rejected'))
    status!: string;

    @AllowNull(true)
    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    reviewed_by!: string | null;

    @AllowNull(true)
    @Column(DataType.TEXT)
    review_comment!: string | null;

    @BelongsTo(() => NotaUsuario, 'note_id')
    nota!: NotaUsuario;

    @BelongsTo(() => Usuario, 'author_id')
    autor!: Usuario;

    @BelongsTo(() => Usuario, 'reviewed_by')
    revisor!: Usuario;
}

@Table({
    tableName: 'user_achievements',
    timestamps: false,
    underscored: true,
    indexes: [{ unique: true, fields: ['user_id', 'achievement_id'] }],
})
export class LogroUsuario extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    user_achievement_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @ForeignKey(() => Logro)
    @Column(DataType.UUID)
    achievement_id!: string;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    unlocked_at!: Date;

    @BelongsTo(() => Usuario)
    usuario!: Usuario;

    @BelongsTo(() => Logro)
    logro!: Logro;
}

// ==========================================
// IA — Perfil de aprendizaje y caza del bug
// ==========================================

@Table({ tableName: 'learning_profiles', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class PerfilAprendizaje extends Model {
    @PrimaryKey
    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Default({})
    @Column(DataType.JSONB)
    languages!: Record<string, number>;

    @Default([])
    @Column(DataType.JSONB)
    concepts_seen!: string[];

    @Default([])
    @Column(DataType.JSONB)
    recurring_errors!: { tag: string; count: number }[];

    @Default([])
    @Column(DataType.JSONB)
    session_summaries!: { at: string; text: string }[];

    @BelongsTo(() => Usuario)
    usuario!: Usuario;
}

@Table({ tableName: 'troll_hunts', timestamps: true, createdAt: 'created_at', updatedAt: false })
export class CazaTroll extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    hunt_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Column(DataType.STRING(50))
    language!: string;

    @Column(DataType.TEXT)
    original_code!: string;

    @Column(DataType.TEXT)
    buggy_code!: string;

    @Column(DataType.INTEGER)
    bug_line!: number;

    @Column(DataType.TEXT)
    bug_explanation!: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    solved!: boolean;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    duration_ms!: number | null;
}

// ==========================================
// IA — RoadMaps
// ==========================================

@Table({ tableName: 'sagas', timestamps: true, createdAt: 'created_at', updatedAt: false })
export class Saga extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    saga_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Column(DataType.TEXT)
    goal!: string;

    @Column(DataType.STRING(255))
    title!: string;

    @HasMany(() => HitoSaga, 'saga_id')
    hitos!: HitoSaga[];
}

@Table({ tableName: 'saga_milestones', timestamps: false })
export class HitoSaga extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    milestone_id!: string;

    @ForeignKey(() => Saga)
    @Column(DataType.UUID)
    saga_id!: string;

    @Column(DataType.INTEGER)
    position!: number;

    @Column(DataType.STRING(20))
    type!: string; // 'note' | 'challenge' | 'project' | 'checkpoint'

    @AllowNull(true)
    @Column(DataType.UUID)
    ref_id!: string | null;

    @Column(DataType.STRING(255))
    title!: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    description!: string | null;

    @Default('pending')
    @Column(DataType.STRING(20))
    status!: string; // 'pending' | 'done' | 'skipped'

    @BelongsTo(() => Saga, 'saga_id')
    saga!: Saga;
}

@Table({ tableName: 'user_emblems', timestamps: true, createdAt: 'awarded_at', updatedAt: false })
export class Emblema extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    emblem_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Column(DataType.STRING(30))
    kind!: string; // 'season' | 'mentor' | 'showcase' | 'tournament'

    @Column(DataType.STRING(80))
    label!: string;

    @Default({})
    @Column(DataType.JSONB)
    meta!: Record<string, any>;
}

@Table({ tableName: 'tournaments', timestamps: true, createdAt: 'created_at', updatedAt: false })
export class Torneo extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    tournament_id!: string;

    @Column(DataType.STRING(160))
    title!: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    description!: string | null;

    @Default('challenges')
    @Column(DataType.STRING(20))
    mode!: string; // 'challenges' | 'troll'

    @AllowNull(true)
    @Column(DataType.STRING(20))
    season!: string | null;

    @Default('upcoming')
    @Column(DataType.STRING(20))
    status!: string; // 'upcoming' | 'active' | 'finished'

    @Column(DataType.DATE)
    starts_at!: Date;

    @Column(DataType.DATE)
    ends_at!: Date;

    @Default(100)
    @Column(DataType.INTEGER)
    reward_xp!: number;

    @AllowNull(true)
    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    created_by!: string | null;

    @BelongsToMany(() => Reto, () => RetoTorneo)
    retos!: Reto[];

    @HasMany(() => ParticipanteTorneo, 'tournament_id')
    participantes!: ParticipanteTorneo[];
}

@Table({ tableName: 'tournament_challenges', timestamps: false })
export class RetoTorneo extends Model {
    @PrimaryKey
    @ForeignKey(() => Torneo)
    @Column(DataType.UUID)
    tournament_id!: string;

    @PrimaryKey
    @ForeignKey(() => Reto)
    @Column(DataType.UUID)
    challenge_id!: string;

    @Default(100)
    @Column(DataType.INTEGER)
    points!: number;
}

@Table({ tableName: 'tournament_participants', timestamps: false })
export class ParticipanteTorneo extends Model {
    @PrimaryKey
    @ForeignKey(() => Torneo)
    @Column(DataType.UUID)
    tournament_id!: string;

    @PrimaryKey
    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Default(0)
    @Column(DataType.INTEGER)
    score!: number;

    @Default(0)
    @Column(DataType.INTEGER)
    solved_count!: number;

    @AllowNull(true)
    @Column(DataType.DATE)
    last_solved_at!: Date | null;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    joined_at!: Date;

    @BelongsTo(() => Usuario)
    usuario!: Usuario;
}

@Table({ tableName: 'tournament_solves', timestamps: false })
export class ResolucionTorneo extends Model {
    @PrimaryKey
    @ForeignKey(() => Torneo)
    @Column(DataType.UUID)
    tournament_id!: string;

    @PrimaryKey
    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @PrimaryKey
    @Column(DataType.UUID)
    challenge_id!: string;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    solved_at!: Date;
}

@Table({ tableName: 'mentor_profiles', timestamps: true, createdAt: 'created_at', updatedAt: false })
export class PerfilMentor extends Model {
    @PrimaryKey
    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    user_id!: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_available!: boolean;

    @Default([])
    @Column(DataType.ARRAY(DataType.STRING))
    languages!: string[];

    @AllowNull(true)
    @Column(DataType.TEXT)
    bio_mentor!: string | null;

    @Default(3)
    @Column(DataType.INTEGER)
    capacity!: number;

    @BelongsTo(() => Usuario)
    usuario!: Usuario;
}

@Table({ tableName: 'mentorships', timestamps: true, createdAt: 'created_at', updatedAt: false })
export class Mentoria extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    mentorship_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    mentor_id!: string;

    @ForeignKey(() => Usuario)
    @Column(DataType.UUID)
    apprentice_id!: string;

    @Default('pending')
    @Column(DataType.STRING(20))
    status!: string; // 'pending' | 'active' | 'ended' | 'rejected'

    @AllowNull(true)
    @Column(DataType.TEXT)
    goal!: string | null;

    @AllowNull(true)
    @Column(DataType.UUID)
    conversation_id!: string | null;

    @AllowNull(true)
    @Column(DataType.DATE)
    ended_at!: Date | null;

    @BelongsTo(() => Usuario, 'mentor_id')
    mentor!: Usuario;

    @BelongsTo(() => Usuario, 'apprentice_id')
    aprendiz!: Usuario;
}

