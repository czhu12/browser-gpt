"""added documents and timestamps to all models

Revision ID: a66b554163fb
Revises: d53dbe59d526
Create Date: 2023-05-13 12:06:08.797750

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a66b554163fb'
down_revision = 'd53dbe59d526'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('documents',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('created_on', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_on', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('thread_id', sa.Integer(), nullable=True),
    sa.Column('content', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['thread_id'], ['threads.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_on', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
        batch_op.add_column(sa.Column('updated_on', sa.DateTime(), server_default=sa.text('now()'), nullable=True))

    with op.batch_alter_table('threads', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_on', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
        batch_op.add_column(sa.Column('updated_on', sa.DateTime(), server_default=sa.text('now()'), nullable=True))

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_on', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
        batch_op.add_column(sa.Column('updated_on', sa.DateTime(), server_default=sa.text('now()'), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('updated_on')
        batch_op.drop_column('created_on')

    with op.batch_alter_table('threads', schema=None) as batch_op:
        batch_op.drop_column('updated_on')
        batch_op.drop_column('created_on')

    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.drop_column('updated_on')
        batch_op.drop_column('created_on')

    op.drop_table('documents')
    # ### end Alembic commands ###