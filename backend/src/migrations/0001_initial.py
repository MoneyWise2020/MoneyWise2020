# Generated by Django 3.1.3 on 2020-11-07 19:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Rule',
            fields=[
                ('id', models.CharField(primary_key=True, serialize=False, verbose_name='ID')),
                ('rule_name', models.CharField(blank=True, max_length=50, null=True)),
                ('rule_frequency', models.CharField(blank=True, max_length=50, null=True)),
                ('rule_amount', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
    ]
