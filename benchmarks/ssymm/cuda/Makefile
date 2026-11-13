CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/ssymm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssymm: ssymm.c $(HDRS) | $(BIN)
	$(CC) ssymm.c -o $(BIN)/ssymm -lcublas

clean:
	rm -rf $(BIN)
