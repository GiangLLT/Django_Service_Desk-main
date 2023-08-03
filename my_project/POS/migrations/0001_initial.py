# Generated by Django 4.1.7 on 2023-05-17 06:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BillHeader',
            fields=[
                ('BillingID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('CompanyCode', models.CharField(max_length=5)),
                ('DivisionName', models.CharField(max_length=255)),
                ('ChannelName', models.CharField(max_length=255)),
                ('CustomerName', models.TextField()),
                ('CustomerAddress', models.TextField()),
                ('CustomerPhone', models.CharField(max_length=15)),
                ('CustomerEmail', models.CharField(max_length=255)),
                ('CustomerVAT', models.CharField(max_length=20)),
                ('TableOrderID', models.IntegerField()),
                ('TableOrderName', models.CharField(max_length=255)),
                ('PaymentName', models.CharField(max_length=255)),
                ('Username', models.CharField(max_length=20)),
                ('FullName', models.CharField(max_length=255)),
                ('PromotionName', models.CharField(max_length=255)),
                ('PromotionTypeID', models.IntegerField()),
                ('PromotionTypeName', models.TextField()),
                ('PromotionDiscount', models.IntegerField()),
                ('BillPrice', models.BigIntegerField()),
                ('BillPriceTax', models.BigIntegerField()),
                ('BillPriceAmount', models.BigIntegerField()),
                ('CurrencyID', models.CharField(max_length=3)),
                ('CurrencyName', models.CharField(max_length=255)),
                ('BillHeaderNote', models.TextField()),
            ],
            options={
                'db_table': 'Bill_Header',
            },
        ),
        migrations.CreateModel(
            name='Channel',
            fields=[
                ('ChannelID', models.AutoField(primary_key=True, serialize=False)),
                ('ChannelName', models.CharField(max_length=255)),
                ('ChannelStatus', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'Channel',
            },
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('CompanyCode', models.CharField(max_length=5, primary_key=True, serialize=False)),
                ('CompanyName', models.CharField(max_length=255)),
                ('CompanyAddress', models.CharField(max_length=255)),
                ('CompanyVAT', models.CharField(max_length=20)),
                ('CompanyStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Company',
            },
        ),
        migrations.CreateModel(
            name='Currency',
            fields=[
                ('CurrencyID', models.CharField(max_length=3, primary_key=True, serialize=False)),
                ('CurrencyName', models.CharField(max_length=255)),
                ('CurrencyStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Currency',
            },
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('CustomerName', models.CharField(max_length=255)),
                ('CustomerImage', models.CharField(max_length=255)),
                ('CustomerBirthday', models.DateField()),
                ('CustomerAddress', models.CharField(max_length=255)),
                ('CustomerPhone', models.CharField(max_length=15)),
                ('CustomerEmail', models.CharField(max_length=255)),
                ('CustomerVAT', models.CharField(max_length=20)),
                ('CustomerPoint', models.IntegerField()),
                ('CustomerRevene', models.BigIntegerField()),
                ('CustomerCard', models.CharField(max_length=50)),
                ('CustomerQRcode', models.CharField(max_length=20)),
                ('CustomerStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Customer',
            },
        ),
        migrations.CreateModel(
            name='CustomerType',
            fields=[
                ('CustomerTypeID', models.AutoField(primary_key=True, serialize=False)),
                ('CustomerTypeName', models.CharField(max_length=255)),
                ('CustomerTypeRevenue', models.BigIntegerField()),
                ('CustomerTypePercent', models.IntegerField()),
                ('CustomerTypeStatus', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'Customer_Type',
            },
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('DepartID', models.CharField(max_length=5, primary_key=True, serialize=False)),
                ('DepartName', models.CharField(max_length=255)),
                ('DepartStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Department',
            },
        ),
        migrations.CreateModel(
            name='Division',
            fields=[
                ('DivisionID', models.AutoField(primary_key=True, serialize=False)),
                ('DivisionName', models.CharField(max_length=255)),
                ('DivisionStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Division',
            },
        ),
        migrations.CreateModel(
            name='Material',
            fields=[
                ('MaterialID', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('MaterialName', models.CharField(max_length=255)),
                ('MaterialImage', models.TextField(blank=True, null=True)),
                ('MaterialNote', models.TextField(blank=True, null=True)),
                ('MaterialDate', models.DateTimeField()),
                ('MaterialVAT', models.IntegerField()),
                ('MaterialStatus', models.BooleanField(default=True)),
                ('DivisionID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.division')),
            ],
            options={
                'db_table': 'Material',
            },
        ),
        migrations.CreateModel(
            name='MaterialType',
            fields=[
                ('MaterialTypeID', models.IntegerField(primary_key=True, serialize=False)),
                ('MaterialTypeName', models.CharField(max_length=255)),
                ('MaterialTypeStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Material_Type',
            },
        ),
        migrations.CreateModel(
            name='MaterialUnit',
            fields=[
                ('MaterialUnitID', models.CharField(max_length=3, primary_key=True, serialize=False)),
                ('MaterialUnitName', models.CharField(max_length=255)),
                ('MaterialUnitStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Material_Unit',
            },
        ),
        migrations.CreateModel(
            name='PaymentTerm',
            fields=[
                ('PaymentID', models.AutoField(primary_key=True, serialize=False)),
                ('PaymentName', models.CharField(max_length=255)),
                ('PaymentStatus', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'Payment_Term',
            },
        ),
        migrations.CreateModel(
            name='Position',
            fields=[
                ('PositionID', models.CharField(max_length=5, primary_key=True, serialize=False)),
                ('PositionName', models.CharField(max_length=255)),
                ('PositionStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Position',
            },
        ),
        migrations.CreateModel(
            name='Promotion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PromotionName', models.CharField(max_length=255)),
                ('PromotionDiscountPer', models.BigIntegerField()),
                ('PromotionDiscountAmount', models.BigIntegerField()),
                ('PromotionDiscountMax', models.BigIntegerField()),
                ('PromotionFrom', models.DateField()),
                ('PromotionTo', models.DateField()),
                ('PromotionStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Promotion',
            },
        ),
        migrations.CreateModel(
            name='PromotionRole',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PromotionRoleName', models.CharField(max_length=255)),
                ('PromotionRoleMin', models.BigIntegerField()),
                ('PromotionRoleChannel', models.BigIntegerField()),
                ('PromotionRoleStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Promotion_Role',
            },
        ),
        migrations.CreateModel(
            name='PromotionType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PromotionTypeName', models.CharField(max_length=255)),
                ('PromotionTypeStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'Promotion_Type',
            },
        ),
        migrations.CreateModel(
            name='SaleOrderHeader',
            fields=[
                ('SaleOrderID', models.BigAutoField(primary_key=True, serialize=False)),
                ('CompanyCode', models.CharField(max_length=5)),
                ('ChannelName', models.CharField(max_length=255)),
                ('DivisionName', models.CharField(max_length=255)),
                ('CustomerName', models.CharField(max_length=255)),
                ('CustomerAddress', models.CharField(max_length=255)),
                ('CustomerPhone', models.CharField(max_length=15)),
                ('CustomerEmail', models.CharField(max_length=255)),
                ('CustomerVAT', models.CharField(max_length=20)),
                ('TableOrderName', models.CharField(max_length=255)),
                ('PaymentName', models.CharField(max_length=255)),
                ('Username', models.CharField(max_length=20)),
                ('FullName', models.CharField(max_length=255)),
                ('PromotionName', models.CharField(max_length=255, null=True)),
                ('PromotionTypeName', models.CharField(max_length=255, null=True)),
                ('PromotionDiscount', models.BigIntegerField(null=True)),
                ('SaleOrderPriceNet', models.BigIntegerField()),
                ('SaleOrderPriceTax', models.BigIntegerField()),
                ('SaleOrderAmount', models.BigIntegerField()),
                ('SaleHeaderNote', models.TextField()),
                ('SaleOrderStatus', models.CharField(max_length=255)),
                ('ChannelID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.channel')),
                ('CustomerID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.customer')),
                ('DivisionID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.division')),
                ('PaymentID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.paymentterm')),
                ('PromotionID', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='POS.promotion')),
                ('PromotionTypeID', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='POS.promotiontype')),
                ('SaleCurencyID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.currency')),
            ],
            options={
                'db_table': 'Sale_Order_Header',
            },
        ),
        migrations.CreateModel(
            name='TableOrder',
            fields=[
                ('TableOrderID', models.AutoField(primary_key=True, serialize=False)),
                ('TableOrderName', models.CharField(max_length=255)),
                ('TableOrderStatus', models.BooleanField(default=True)),
                ('TableOrderPerson', models.IntegerField()),
            ],
            options={
                'db_table': 'Table_Order',
            },
        ),
        migrations.CreateModel(
            name='UserGroup',
            fields=[
                ('UserGroupID', models.CharField(max_length=5, primary_key=True, serialize=False)),
                ('UserGroupName', models.CharField(max_length=255)),
                ('UserGroupStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'User_Group',
            },
        ),
        migrations.CreateModel(
            name='UserRole',
            fields=[
                ('UserRoleID', models.CharField(max_length=150, primary_key=True, serialize=False)),
                ('UserRoleName', models.CharField(max_length=255)),
                ('UserRoleStatus', models.BooleanField()),
            ],
            options={
                'db_table': 'User_Role',
            },
        ),
        migrations.CreateModel(
            name='UserSY',
            fields=[
                ('UserID', models.AutoField(primary_key=True, serialize=False)),
                ('Username', models.CharField(max_length=100)),
                ('Password', models.CharField(max_length=100)),
                ('FullName', models.CharField(max_length=255)),
                ('ImageUrl', models.TextField()),
                ('BirthDay', models.DateField(blank=True, null=True)),
                ('Email', models.CharField(max_length=255)),
                ('Gender', models.CharField(max_length=5)),
                ('Address', models.CharField(max_length=255)),
                ('CreateBy', models.CharField(max_length=20)),
                ('CreateDate', models.DateTimeField()),
                ('UserRole', models.IntegerField()),
                ('UserStatus', models.BooleanField()),
                ('CompanyCode', models.ForeignKey(db_column='CompanyCode', on_delete=django.db.models.deletion.CASCADE, to='POS.company')),
                ('DepartID', models.ForeignKey(db_column='DepartID', on_delete=django.db.models.deletion.CASCADE, to='POS.department')),
                ('PositionID', models.ForeignKey(db_column='PositionID', on_delete=django.db.models.deletion.CASCADE, to='POS.position')),
                ('UserGroupID', models.ForeignKey(db_column='UserGroupID', on_delete=django.db.models.deletion.CASCADE, to='POS.usergroup')),
            ],
            options={
                'db_table': 'User_SY',
            },
        ),
        migrations.CreateModel(
            name='SaleOrderItem',
            fields=[
                ('SaleID', models.BigAutoField(primary_key=True, serialize=False)),
                ('SaleItem', models.IntegerField()),
                ('MaterialID', models.CharField(max_length=10)),
                ('MaterialName', models.CharField(max_length=255)),
                ('DivisionName', models.CharField(max_length=255)),
                ('ChannelName', models.CharField(max_length=255)),
                ('SaleQuantity', models.IntegerField()),
                ('MaterialUnitID', models.CharField(max_length=3)),
                ('MaterialUnitName', models.CharField(max_length=255)),
                ('PromotionName', models.CharField(max_length=255)),
                ('PromotionTypeID', models.IntegerField()),
                ('PromotionTypeName', models.TextField()),
                ('SalePriceUnit', models.BigIntegerField()),
                ('SalePriceDiscount', models.BigIntegerField()),
                ('SalePriceUnitTax', models.BigIntegerField()),
                ('SalePrice', models.BigIntegerField()),
                ('SaleCurencyID', models.CharField(max_length=3)),
                ('SaleItemNote', models.TextField()),
                ('ChannelID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.channel')),
                ('DivisionID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.division')),
                ('PromotionID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.promotion')),
                ('SaleOrderID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.saleorderheader')),
            ],
            options={
                'db_table': 'Sale_Order_Item',
            },
        ),
        migrations.AddField(
            model_name='saleorderheader',
            name='TableOrderID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.tableorder'),
        ),
        migrations.AddField(
            model_name='saleorderheader',
            name='UserID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.usersy'),
        ),
        migrations.AddField(
            model_name='promotion',
            name='PromotionRoleID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.promotionrole'),
        ),
        migrations.AddField(
            model_name='promotion',
            name='PromotionTypeID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.promotiontype'),
        ),
        migrations.CreateModel(
            name='PriceMaterial',
            fields=[
                ('PriceID', models.AutoField(primary_key=True, serialize=False)),
                ('PriceAmount', models.BigIntegerField()),
                ('PriceDiscount', models.BigIntegerField()),
                ('PriceDiscountType', models.CharField(max_length=50)),
                ('PriceFrom', models.DateField()),
                ('PriceTo', models.DateField()),
                ('CreateBy', models.CharField(max_length=20)),
                ('CreateDate', models.DateTimeField()),
                ('CompanyCode', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.company')),
                ('CurencyID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.currency')),
                ('MaterialID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.material')),
            ],
            options={
                'db_table': 'Price_Material',
            },
        ),
        migrations.CreateModel(
            name='MaterialCompany',
            fields=[
                ('MaterialComID', models.AutoField(primary_key=True, serialize=False)),
                ('MaterialName', models.CharField(max_length=255)),
                ('CompanyName', models.CharField(max_length=255)),
                ('MaterialComFrom', models.DateField()),
                ('MaterialComTo', models.DateField()),
                ('MaterialStatus', models.BooleanField(default=True)),
                ('CompanyCode', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.company')),
                ('MaterialID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.material')),
            ],
            options={
                'db_table': 'Material_Company',
            },
        ),
        migrations.AddField(
            model_name='material',
            name='MaterialTypeID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.materialtype'),
        ),
        migrations.AddField(
            model_name='material',
            name='MaterialUnitID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.materialunit'),
        ),
        migrations.AddField(
            model_name='material',
            name='MaterialUserCreate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.usersy'),
        ),
        migrations.AddField(
            model_name='customer',
            name='CustomerTypeID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.customertype'),
        ),
        migrations.CreateModel(
            name='BillItem',
            fields=[
                ('BillID', models.BigAutoField(primary_key=True, serialize=False)),
                ('BillItem', models.IntegerField()),
                ('MaterialID', models.CharField(max_length=10)),
                ('MaterialName', models.CharField(max_length=255)),
                ('DivisionName', models.CharField(max_length=255)),
                ('ChannelName', models.CharField(max_length=255)),
                ('SaleQuantity', models.IntegerField()),
                ('MaterialUnitID', models.CharField(max_length=3)),
                ('MaterialUnitName', models.CharField(max_length=255)),
                ('PromotionName', models.CharField(max_length=255)),
                ('PromotionTypeID', models.IntegerField()),
                ('PromotionTypeName', models.TextField()),
                ('BillPriceUnit', models.BigIntegerField()),
                ('BillPriceDiscount', models.BigIntegerField()),
                ('BillPriceUnitTax', models.BigIntegerField()),
                ('BillPrice', models.BigIntegerField()),
                ('BillCurencyID', models.CharField(max_length=3)),
                ('BillItemNote', models.TextField()),
                ('BillingID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.billheader')),
                ('ChannelID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.channel')),
                ('DivisionID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.division')),
                ('PromotionID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.promotion')),
            ],
            options={
                'db_table': 'BILL_ITEM',
            },
        ),
        migrations.AddField(
            model_name='billheader',
            name='ChannelID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.channel'),
        ),
        migrations.AddField(
            model_name='billheader',
            name='CustomerID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.customer'),
        ),
        migrations.AddField(
            model_name='billheader',
            name='DivisionID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.division'),
        ),
        migrations.AddField(
            model_name='billheader',
            name='PaymentID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.paymentterm'),
        ),
        migrations.AddField(
            model_name='billheader',
            name='PromotionID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.promotion'),
        ),
        migrations.AddField(
            model_name='billheader',
            name='SaleOrderID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.saleorderheader'),
        ),
        migrations.AddField(
            model_name='billheader',
            name='UserID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.usersy'),
        ),
        migrations.CreateModel(
            name='Authorize',
            fields=[
                ('AhthorizeID', models.AutoField(primary_key=True, serialize=False)),
                ('AuthorizeFrom', models.DateField()),
                ('AuthorizeTo', models.DateField()),
                ('AuthorizeStatus', models.BooleanField()),
                ('UserID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.usersy')),
                ('UserRoleID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='POS.userrole')),
            ],
            options={
                'db_table': 'Authorize',
            },
        ),
    ]